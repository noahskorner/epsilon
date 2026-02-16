import { QueueServiceClient, StorageSharedKeyCredential } from '@azure/storage-queue';

export type EventMessage = {
  name: string;
  payload: unknown;
};

export interface EventStorage {
  publishEvent(event: EventMessage): Promise<void>;
}

export type AzureQueueStorageConfig = {
  endpoint: string;
  account: string;
  accountKey: string;
  queue: string;
};

export class AzureQueueStorage implements EventStorage {
  private readonly queueClient;
  private queueReady = false;

  constructor(config: AzureQueueStorageConfig) {
    const credential = new StorageSharedKeyCredential(config.account, config.accountKey);
    const serviceClient = new QueueServiceClient(config.endpoint, credential);

    this.queueClient = serviceClient.getQueueClient(config.queue);
  }

  async publishEvent(event: EventMessage): Promise<void> {
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
