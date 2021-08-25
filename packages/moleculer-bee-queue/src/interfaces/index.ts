import { Options } from '@d0whc3r/moleculer-decorators';
import { ServiceSettingSchema } from 'moleculer';
import { Job, QueueSettings } from 'bee-queue';

export type BeeQueueServiceOptionsSettings = ServiceSettingSchema & QueueSettings;

export interface BeeQueueServiceOptions extends Options {
  name: 'bee-queue';
  settings?: BeeQueueServiceOptionsSettings;
}

export type JobHandler<T, U> = (job: Job<T>) => Promise<U>;

export type QueueDefinition<T, U> =
  | JobHandler<T, U>
  | (QueueSettings & {
      handler: JobHandler<T, U>;
    });
