import { QueueSettings } from 'bee-queue';

export function Queue(name: string, settings?: QueueSettings) {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    if (!target.schema) {
      target.schema = { queues: {} };
    }
    (target.schema.queues || (target.schema.queues = {}))[name] = {
      ...settings,
      handler: descriptor.value
    };
  };
}
