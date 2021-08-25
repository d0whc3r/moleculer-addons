import { Method, Service } from '@d0whc3r/moleculer-decorators';
import { BeeQueueServiceOptions, BeeQueueServiceOptionsSettings, JobHandler, QueueDefinition } from './interfaces';
import moleculer from 'moleculer';
import BeeQueue, { QueueSettings } from 'bee-queue';

export class _BeeQueue<T = any, U = any> extends moleculer.Service<BeeQueueServiceOptionsSettings> {
  public name = 'bee-queue';
  public settings: BeeQueueServiceOptionsSettings = {};
  private $queues: Record<string, BeeQueue<T>> = {};

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // public get name() {
  //   return this._name || 'bee-queue';
  // }
  //
  // public set name(value: string) {
  //   this._name = value;
  // }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // public get settings() {
  //   return this._settings;
  // }
  //
  // public set settings(value: BeeQueueServiceOptionsSettings) {
  //   this._settings = value;
  // }

  @Method
  /**
   * Get a queue by name
   * @param {string} queueName
   * @param {Moleculer.ServiceSettingSchema & BeeQueue.QueueSettings} queueSettings
   * @returns {Record<string, BeeQueue<T>>[string]}
   */
  getQueue(queueName: string, queueSettings = this.settings) {
    if (!this.$queues[queueName]) {
      this.$queues[queueName] = new BeeQueue<T>(queueName, queueSettings);
    }
    return this.$queues[queueName];
  }

  @Method
  /**
   * Create a new job in a queue
   * @param {string} queueName
   * @param {T} payload
   * @returns {BeeQueue.Job<T>}
   */
  createJob(queueName: string, payload: T) {
    return this.getQueue(queueName).createJob(payload);
  }

  started() {
    if (this.schema.queues) {
      Object.entries<QueueDefinition<T, U>>(this.schema.queues).forEach(([name, params]) => {
        let fn: JobHandler<T, U>;
        let queueSettings: QueueSettings | undefined;
        if ('handler' in params) {
          const { handler, ...otherParams } = params;
          fn = handler;
          queueSettings = otherParams;
        } else {
          fn = params;
        }
        this.getQueue(name, queueSettings).process(fn.bind(this));
      });
    }
    return Promise.resolve();
  }
}

@Service<BeeQueueServiceOptions>({
  name: 'bee-queue'
})
export default class BeeQueueAsService<QueuePayload = any, JobResponse = any> extends _BeeQueue<QueuePayload, JobResponse> {}
