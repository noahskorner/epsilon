export interface Environment {
  DATABASE_URL: string;
  RESOURCE_MANAGER_DATABASE_URL: string;
  RESOURCE_MANAGER_SERVICE_MODE: 'real' | 'test' | 'mock';
  AZURITE_ENDPOINT: string;
  AZURITE_ACCOUNT: string;
  AZURITE_KEY: string;
  EMAIL_SERVER: string;
  EMAIL_FROM: string;
  OPENAI_API_KEY: string;
  OLLAMA_BASE_URL: string;
  OLLAMA_MODEL: string;
}

const REQUIRED_KEYS: Array<keyof Environment> = [
  'DATABASE_URL',
  'RESOURCE_MANAGER_DATABASE_URL',
  'AZURITE_ENDPOINT',
  'AZURITE_ACCOUNT',
  'AZURITE_KEY',
  'EMAIL_SERVER',
  'EMAIL_FROM',
  'OPENAI_API_KEY',
  'OLLAMA_BASE_URL',
  'OLLAMA_MODEL',
];

const URL_KEYS: Array<keyof Environment> = [
  'DATABASE_URL',
  'RESOURCE_MANAGER_DATABASE_URL',
  'AZURITE_ENDPOINT',
  'EMAIL_SERVER',
  'OLLAMA_BASE_URL',
];

const EMAIL_FROM_KEY: keyof Environment = 'EMAIL_FROM';
const RESOURCE_MANAGER_SERVICE_MODE_KEY: keyof Environment = 'RESOURCE_MANAGER_SERVICE_MODE';
const RESOURCE_MANAGER_SERVICE_MODES = ['real', 'test', 'mock'] as const;
type ResourceManagerServiceMode = (typeof RESOURCE_MANAGER_SERVICE_MODES)[number];

function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function hasEmailLikeFormat(value: string): boolean {
  return value.includes('@');
}

function isResourceManagerServiceMode(value: string): value is ResourceManagerServiceMode {
  return (RESOURCE_MANAGER_SERVICE_MODES as readonly string[]).includes(value);
}

function loadEnvironment(env: NodeJS.ProcessEnv = process.env): Environment {
  const missing: string[] = [];
  const invalid: string[] = [];
  const values: Partial<Environment> = {};

  for (const key of REQUIRED_KEYS) {
    const value = env[key];
    if (!value) {
      missing.push(key);
    } else {
      values[key] = value;
    }
  }

  for (const key of URL_KEYS) {
    const value = values[key];
    if (value && !isValidUrl(value)) {
      invalid.push(key);
    }
  }

  const emailFrom = values[EMAIL_FROM_KEY];
  if (emailFrom && !hasEmailLikeFormat(emailFrom)) {
    invalid.push(EMAIL_FROM_KEY);
  }

  const resourceManagerServiceMode = env[RESOURCE_MANAGER_SERVICE_MODE_KEY] ?? 'real';
  if (!isResourceManagerServiceMode(resourceManagerServiceMode)) {
    invalid.push(RESOURCE_MANAGER_SERVICE_MODE_KEY);
  } else {
    values[RESOURCE_MANAGER_SERVICE_MODE_KEY] = resourceManagerServiceMode;
  }

  if (missing.length || invalid.length) {
    const messages: string[] = [];
    if (missing.length) {
      messages.push(`Missing required environment variables: ${missing.join(', ')}`);
    }
    if (invalid.length) {
      messages.push(`Invalid environment variables: ${invalid.join(', ')}`);
    }
    throw new Error(`[environment] ${messages.join(' | ')}`);
  }

  return values as Environment;
}

export const ENV = loadEnvironment();
