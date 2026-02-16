import os from 'node:os';
import path from 'node:path';

export type RuntimeState = {
  serverPid: number;
  webBaseUrl: string;
  postgresContainerId: string;
  azuriteContainerId: string;
};

export const RUNTIME_STATE_FILE = path.join(os.tmpdir(), 'epsilon-web-test-runtime.json');
