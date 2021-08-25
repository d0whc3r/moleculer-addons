import { _BeeQueue } from './bee-queue.service';
import { BeeQueueServiceOptionsSettings } from './interfaces';

export function BeeQueueMixin<QueuePayload = any, JobResponse = any>(settings?: BeeQueueServiceOptionsSettings) {
  const beeQueue = _BeeQueue.prototype as _BeeQueue<QueuePayload, JobResponse>;
  if (settings) {
    beeQueue.settings = settings;
  }
  return beeQueue;
}
