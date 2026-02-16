import { spawn, type ChildProcess } from 'node:child_process';
import { once } from 'node:events';
import fs from 'node:fs/promises';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { config as loadDotEnv } from 'dotenv';
import { GenericContainer, Wait, type StartedTestContainer } from 'testcontainers';
import { RUNTIME_STATE_FILE, type RuntimeState } from './runtimeState';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WEB_APP_DIR = path.resolve(__dirname, '../../web');
const WEB_ENV_TEST_PATH = path.join(WEB_APP_DIR, '.env.test');
const AZURITE_KEY =
  'Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==';

type Runtime = {
  serverProcess: ChildProcess;
  postgresContainer: StartedTestContainer;
  azuriteContainer: StartedTestContainer;
};

async function getFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on('error', reject);
    server.listen(0, () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        reject(new Error('Unable to determine a free port'));
        return;
      }
      server.close((closeError) => {
        if (closeError) {
          reject(closeError);
          return;
        }
        resolve(address.port);
      });
    });
  });
}

async function waitForServerReady(baseUrl: string): Promise<void> {
  const timeoutMs = 120_000;
  const startedAt = Date.now();
  const endpoint = `${baseUrl}/api/openapi.json`;

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(endpoint);
      if (response.ok) {
        return;
      }
    } catch {
      // Retry while server is still booting.
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Next.js server did not become ready within ${timeoutMs}ms`);
}

function startWebServer(env: NodeJS.ProcessEnv, port: number): ChildProcess {
  const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const serverProcess = spawn(npmCommand, ['run', 'dev', '--', '--port', String(port)], {
    cwd: WEB_APP_DIR,
    env,
    stdio: 'inherit',
  });

  if (!serverProcess.pid) {
    throw new Error('Failed to start Next.js test server');
  }

  return serverProcess;
}

async function stopWebServer(serverProcess: ChildProcess): Promise<void> {
  const serverPid = serverProcess.pid;
  if (!serverPid) {
    return;
  }

  if (serverProcess.killed || serverProcess.exitCode !== null) {
    return;
  }

  if (process.platform === 'win32') {
    spawn('taskkill', ['/PID', String(serverPid), '/T', '/F'], {
      stdio: 'ignore',
      windowsHide: true,
    });
  } else {
    serverProcess.kill('SIGTERM');
  }
  await Promise.race([
    once(serverProcess, 'exit'),
    new Promise((resolve) => setTimeout(resolve, 10_000)),
  ]);

  if (serverProcess.exitCode === null) {
    if (process.platform === 'win32') {
      spawn('taskkill', ['/PID', String(serverPid), '/T', '/F'], {
        stdio: 'ignore',
        windowsHide: true,
      });
    } else {
      serverProcess.kill('SIGKILL');
    }
  }
}

async function startRuntime(): Promise<Runtime> {
  loadDotEnv({ path: WEB_ENV_TEST_PATH, override: true });

  const postgresContainer = await new GenericContainer('pgvector/pgvector:pg16')
    .withEnvironment({
      POSTGRES_USER: 'postgres',
      POSTGRES_PASSWORD: 'postgres',
      POSTGRES_DB: 'postgres',
    })
    .withExposedPorts(5432)
    .withWaitStrategy(Wait.forListeningPorts())
    .start();

  const azuriteContainer = await new GenericContainer(
    'mcr.microsoft.com/azure-storage/azurite:3.35.0',
  )
    .withCommand([
      'azurite',
      '--blobHost',
      '0.0.0.0',
      '--queueHost',
      '0.0.0.0',
      '--tableHost',
      '0.0.0.0',
    ])
    .withExposedPorts(10000, 10001, 10002)
    .withWaitStrategy(Wait.forListeningPorts())
    .start();

  const webPort = await getFreePort();
  const webBaseUrl = `http://127.0.0.1:${webPort}`;
  const postgresPort = postgresContainer.getMappedPort(5432);
  const azuriteBlobPort = azuriteContainer.getMappedPort(10000);

  const serverEnv: NodeJS.ProcessEnv = {
    ...process.env,
    NODE_ENV: 'test',
    DATABASE_URL: `postgresql://postgres:postgres@127.0.0.1:${postgresPort}/postgres`,
    RESOURCE_MANAGER_DATABASE_URL: `postgresql://postgres:postgres@127.0.0.1:${postgresPort}/postgres`,
    AZURITE_ENDPOINT: `http://127.0.0.1:${azuriteBlobPort}/devstoreaccount1`,
    AZURITE_ACCOUNT: 'devstoreaccount1',
    AZURITE_KEY: AZURITE_KEY,
  };

  let serverProcess: ChildProcess | undefined;
  try {
    serverProcess = startWebServer(serverEnv, webPort);
    await waitForServerReady(webBaseUrl);
    const serverPid = serverProcess.pid;
    if (!serverPid) {
      throw new Error('Could not determine Next.js server PID');
    }

    const state: RuntimeState = {
      serverPid,
      webBaseUrl,
      postgresContainerId: postgresContainer.getId(),
      azuriteContainerId: azuriteContainer.getId(),
    };
    await fs.writeFile(RUNTIME_STATE_FILE, JSON.stringify(state), 'utf8');

    return {
      serverProcess,
      postgresContainer,
      azuriteContainer,
    };
  } catch (error) {
    if (serverProcess) {
      await stopWebServer(serverProcess);
    }
    await azuriteContainer.stop();
    await postgresContainer.stop();
    await fs.rm(RUNTIME_STATE_FILE, { force: true });
    throw error;
  }
}

export default async function globalSetup(): Promise<void> {
  await startRuntime();
}
