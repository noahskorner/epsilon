import { QueueServiceClient, StorageSharedKeyCredential } from '@azure/storage-queue';

export const DEFAULT_EVENTS_QUEUE = 'documents-ingested';

export type EventMessage = {
  type: string;
  [key: string]: unknown;
};

export interface EventStorage<TEvent extends EventMessage = EventMessage> {
  publishEvent(event: TEvent): Promise<void>;
}

export type AzureQueueStorageConfig = {
  endpoint: string;
  account: string;
  accountKey: string;
  queue: string;
};

export class AzureQueueStorage<TEvent extends EventMessage = EventMessage>
  implements EventStorage<TEvent>
{
  private readonly queueClient;
  private queueReady = false;

  constructor(config: AzureQueueStorageConfig) {
    const credential = new StorageSharedKeyCredential(config.account, config.accountKey);
    const serviceClient = new QueueServiceClient(config.endpoint, credential);

    this.queueClient = serviceClient.getQueueClient(config.queue);
  }

  async publishEvent(event: TEvent): Promise<void> {
    await this.ensureQueue();
    const payload = JSON.stringify(event);
    await this.queueClient.sendMessage(Buffer.from(payload).toString('base64'));
  }

  private async ensureQueue(): Promise<void> {
    if (this.queueReady) return;
    await this.queueClient.createIfNotExists();
    this.queueReady = true;
  }
}
