import fs from 'node:fs/promises';

import { test, expect } from '@playwright/test';
import { RUNTIME_STATE_FILE, type RuntimeState } from '../src/runtimeState';

test('GET /api/openapi.json returns JSON with status 200', async ({ request }) => {
  const runtimeStateContents = await fs.readFile(RUNTIME_STATE_FILE, 'utf8');
  const runtimeState = JSON.parse(runtimeStateContents) as RuntimeState;
  const baseUrl = runtimeState.webBaseUrl;

  const response = await request.get(`${baseUrl}/api/openapi.json`);
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body).toBeTruthy();
  expect(typeof body).toBe('object');
});
