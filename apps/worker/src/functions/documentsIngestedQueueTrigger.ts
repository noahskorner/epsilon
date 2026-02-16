import { app, InvocationContext } from '@azure/functions';

type DocumentsIngestedEvent = {
  type: 'documents_ingested';
  batch_id: string;
  index_name: string;
};

const DOCUMENTS_INGESTED_QUEUE = 'documents-ingested';

function parseQueueEvent(queueItem: unknown): DocumentsIngestedEvent | null {
  if (typeof queueItem === 'string') {
    try {
      return parseQueueEvent(JSON.parse(queueItem));
    } catch {
      return null;
    }
  }

  if (typeof queueItem !== 'object' || queueItem === null || Array.isArray(queueItem)) {
    return null;
  }

  const candidate = queueItem as Record<string, unknown>;
  if (
    candidate.type !== 'documents_ingested' ||
    typeof candidate.batch_id !== 'string' ||
    typeof candidate.index_name !== 'string'
  ) {
    return null;
  }

  return {
    type: 'documents_ingested',
    batch_id: candidate.batch_id,
    index_name: candidate.index_name,
  };
}

export async function documentsIngestedQueueTrigger(
  queueItem: unknown,
  context: InvocationContext
): Promise<void> {
  const event = parseQueueEvent(queueItem);

  if (!event) {
    context.warn('Received unexpected queue payload', queueItem);
    return;
  }

  context.log(
    `Documents ingested batch received. index_name=${event.index_name} batch_id=${event.batch_id}`
  );
}

app.storageQueue('documentsIngestedQueueTrigger', {
  connection: 'AzureWebJobsStorage',
  queueName: DOCUMENTS_INGESTED_QUEUE,
  handler: documentsIngestedQueueTrigger,
});
