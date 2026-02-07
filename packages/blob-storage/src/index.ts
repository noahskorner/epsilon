import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';

export type BlobBody = Buffer | Uint8Array | string;

export interface BlobStorage {
  put(path: string, body: BlobBody): Promise<void>;
  get(path: string): Promise<Buffer | null>;
  delete(path: string): Promise<void>;
}

export type AzureBlobStorageConfig = {
  endpoint: string;
  account: string;
  accountKey: string;
  container: string;
};

export class AzureBlobStorage implements BlobStorage {
  private readonly containerClient;
  private containerReady = false;

  constructor(config: AzureBlobStorageConfig) {
    const credential = new StorageSharedKeyCredential(config.account, config.accountKey);
    const serviceClient = new BlobServiceClient(config.endpoint, credential);

    this.containerClient = serviceClient.getContainerClient(config.container);
  }

  async put(path: string, body: BlobBody): Promise<void> {
    await this.ensureContainer();
    const blockBlobClient = this.containerClient.getBlockBlobClient(path);
    const payload = typeof body === 'string' ? Buffer.from(body) : Buffer.from(body);

    await blockBlobClient.uploadData(payload);
  }

  async get(path: string): Promise<Buffer | null> {
    await this.ensureContainer();
    const blockBlobClient = this.containerClient.getBlockBlobClient(path);

    try {
      return await blockBlobClient.downloadToBuffer();
    } catch (error) {
      const statusCode = (error as { statusCode?: number }).statusCode;
      if (statusCode === 404) {
        return null;
      }

      throw error;
    }
  }

  async delete(path: string): Promise<void> {
    await this.ensureContainer();
    await this.containerClient.getBlockBlobClient(path).deleteIfExists();
  }

  private async ensureContainer(): Promise<void> {
    if (this.containerReady) return;
    await this.containerClient.createIfNotExists();
    this.containerReady = true;
  }
}
