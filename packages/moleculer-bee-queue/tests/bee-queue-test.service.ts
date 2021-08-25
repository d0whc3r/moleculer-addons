import { Method, Service } from '@d0whc3r/moleculer-decorators';
import { BeeQueueMixin, BeeQueueService, Queue } from '../src';
import { Job } from 'bee-queue';
import { JobResponse, QueuePayload } from './bee-queue-test.types';

@Service({
  name: 'bee-queue-test',
  mixins: [BeeQueueMixin<QueuePayload, JobResponse>({ prefix: 'queue-test' })]
})
export class BeeQueueTestService extends BeeQueueService<QueuePayload, JobResponse> {
  @Queue('sample-queue', {
    prefix: 'sample-queue-test'
  })
  sampleQueue(job: Job<QueuePayload>): Promise<JobResponse> {
    job.reportProgress(10);
    return Promise.resolve({
      testId: job.data.testId,
      newStatus: !job.data.testStatus
    });
  }

  @Queue('default-queue')
  defQueue(job: Job<QueuePayload>): Promise<JobResponse> {
    job.reportProgress(20);
    return Promise.resolve({
      testId: job.data.testId + '-default',
      newStatus: !job.data.testStatus
    });
  }

  @Method
  executeQueue() {
    const job = this.createJob('sample-queue', { testId: 'execute-queue-id', testStatus: true });
    job.on('progress', (progress: number) => {
      this.logger.info(`Job #${job.id} progress is ${progress}%`);
    });
    job.on('succeeded', (res) => {
      this.logger.info(`Job #${job.id} completed!. Result:`, res);
    });

    void job.retries(2).save();
  }

  @Method
  executeQueueDefault() {
    const job = this.createJob('default-queue', { testId: 'execute-queue-id', testStatus: true });
    job.on('progress', (progress: number) => {
      this.logger.info(`Job #${job.id} progress is ${progress}%`);
    });
    job.on('succeeded', (res) => {
      this.logger.info(`Job #${job.id} completed!. Result:`, res);
    });

    void job.retries(2).save();
  }
}
