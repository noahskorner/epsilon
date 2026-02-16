import { app, InvocationContext } from '@azure/functions';

export async function helloWorldQueueTrigger(
  queueItem: unknown,
  context: InvocationContext,
): Promise<void> {
  context.log('Hello from queue trigger. Message:', queueItem);
}

app.storageQueue('helloWorldQueueTrigger', {
  connection: 'AzureWebJobsStorage',
  queueName: 'hello-world',
  handler: helloWorldQueueTrigger,
});
