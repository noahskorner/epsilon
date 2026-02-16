import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';

import { RUNTIME_STATE_FILE, type RuntimeState } from './runtimeState';

function stopContainer(containerId: string): void {
  const dockerCommand = process.platform === 'win32' ? 'docker.exe' : 'docker';
  spawnSync(dockerCommand, ['rm', '-f', containerId], { stdio: 'inherit' });
}

function stopServer(serverPid: number): void {
  try {
    if (process.platform === 'win32') {
      spawnSync('taskkill', ['/PID', String(serverPid), '/T', '/F'], { stdio: 'ignore' });
      return;
    }
    process.kill(serverPid, 'SIGTERM');
  } catch {
    // The process already exited.
  }
}

export default async function globalTeardown(): Promise<void> {
  try {
    const stateContents = await fs.readFile(RUNTIME_STATE_FILE, 'utf8');
    const state = JSON.parse(stateContents) as RuntimeState;

    stopServer(state.serverPid);
    stopContainer(state.azuriteContainerId);
    stopContainer(state.postgresContainerId);
  } catch {
    // Setup did not complete or state file was already removed.
  } finally {
    await fs.rm(RUNTIME_STATE_FILE, { force: true });
  }
}
