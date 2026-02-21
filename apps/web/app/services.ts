import { ENV } from 'environment';
import { AzureQueueStorage, DEFAULT_EVENTS_QUEUE, type EventStorage } from 'event-storage';
import {
  PostgresResourceManager,
  ensureValidDatabaseName,
  type ResourceManager,
} from 'resource-manager';

type ServiceToken<T> = symbol & { readonly __type?: T };
type ServiceLifetime = 'singleton' | 'scoped' | 'transient';
type ServiceFactory<T> = (scope: ServiceScope) => T;
type ServiceRegistration<T> = {
  lifetime: ServiceLifetime;
  factory: ServiceFactory<T>;
};

class ServiceCollection {
  private readonly registrations = new Map<ServiceToken<unknown>, ServiceRegistration<unknown>>();
  private readonly singletons = new Map<ServiceToken<unknown>, unknown>();

  registerSingleton<T>(token: ServiceToken<T>, factory: ServiceFactory<T>): void {
    this.registrations.set(token, { lifetime: 'singleton', factory });
  }

  registerScoped<T>(token: ServiceToken<T>, factory: ServiceFactory<T>): void {
    this.registrations.set(token, { lifetime: 'scoped', factory });
  }

  registerTransient<T>(token: ServiceToken<T>, factory: ServiceFactory<T>): void {
    this.registrations.set(token, { lifetime: 'transient', factory });
  }

  createScope(): ServiceScope {
    return new ServiceScope(this.registrations, this.singletons);
  }
}

export class ServiceScope {
  private readonly scopedInstances = new Map<ServiceToken<unknown>, unknown>();

  constructor(
    private readonly registrations: Map<ServiceToken<unknown>, ServiceRegistration<unknown>>,
    private readonly singletons: Map<ServiceToken<unknown>, unknown>
  ) {}

  resolve<T>(token: ServiceToken<T>): T {
    const registration = this.registrations.get(token);

    if (!registration) {
      throw new Error(`Service not registered: ${String(token.description)}`);
    }

    if (registration.lifetime === 'singleton') {
      if (!this.singletons.has(token)) {
        this.singletons.set(token, registration.factory(this));
      }
      return this.singletons.get(token) as T;
    }

    if (registration.lifetime === 'scoped') {
      if (!this.scopedInstances.has(token)) {
        this.scopedInstances.set(token, registration.factory(this));
      }
      return this.scopedInstances.get(token) as T;
    }

    return registration.factory(this) as T;
  }
}

function createToken<T>(description: string): ServiceToken<T> {
  return Symbol(description) as ServiceToken<T>;
}

export const SERVICE_TOKENS = {
  resourceManager: createToken<ResourceManager>('resourceManager'),
  eventStorage: createToken<EventStorage>('eventStorage'),
} as const;

class TestResourceManager implements ResourceManager {
  async provisionPgvectorDatabase(name: string): Promise<{ name: string; url: string }> {
    ensureValidDatabaseName(name);
    const url = new URL(ENV.DATABASE_URL);
    url.pathname = `/${name}`;
    return { name, url: url.toString() };
  }
}

class MockResourceManager implements ResourceManager {
  async provisionPgvectorDatabase(name: string): Promise<{ name: string; url: string }> {
    ensureValidDatabaseName(name);
    return { name, url: `mock://resource-manager/${name}` };
  }
}

function createResourceManager(): ResourceManager {
  if (ENV.RESOURCE_MANAGER_SERVICE_MODE === 'real') {
    return new PostgresResourceManager({
      adminDatabaseUrl: ENV.RESOURCE_MANAGER_DATABASE_URL,
    });
  }

  if (ENV.RESOURCE_MANAGER_SERVICE_MODE === 'test') {
    return new TestResourceManager();
  }

  if (ENV.RESOURCE_MANAGER_SERVICE_MODE === 'mock') {
    return new MockResourceManager();
  }

  const neverMode: never = ENV.RESOURCE_MANAGER_SERVICE_MODE;
  throw new Error(`Unsupported resource manager mode: ${neverMode}`);
}

const services = new ServiceCollection();

services.registerSingleton(SERVICE_TOKENS.resourceManager, () => {
  return createResourceManager();
});

services.registerSingleton(SERVICE_TOKENS.eventStorage, () => {
  return new AzureQueueStorage({
    endpoint: ENV.AZURITE_ENDPOINT,
    account: ENV.AZURITE_ACCOUNT,
    accountKey: ENV.AZURITE_KEY,
    queue: DEFAULT_EVENTS_QUEUE,
  });
});

export function createServiceScope(): ServiceScope {
  return services.createScope();
}
