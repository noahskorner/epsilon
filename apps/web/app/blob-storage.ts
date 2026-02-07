import { AzureBlobStorage } from 'blob-storage';
import { ENV } from 'environment';

let blobStorage: AzureBlobStorage | null = null;

export function getBlobStorage(): AzureBlobStorage {
  if (!blobStorage) {
    blobStorage = new AzureBlobStorage({
      endpoint: ENV.AZURITE_ENDPOINT,
      account: ENV.AZURITE_ACCOUNT,
      accountKey: ENV.AZURITE_KEY,
      container: 'files',
    });
  }

  return blobStorage;
}
