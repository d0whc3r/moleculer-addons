import { BeeQueueMixin } from '../src';
import { _BeeQueue } from '../src/bee-queue.service';

describe('Test mixin generated for bee-queue', () => {
  let service: _BeeQueue;

  beforeAll(() => {
    service = BeeQueueMixin({ prefix: 'test-prefix' });
  });

  it('should exist', () => {
    expect(BeeQueueMixin).toBeDefined();
    expect(service).toBeDefined();
  });
  it('should have name and settings', () => {
    expect(service)
      .toBeObject()
      .toContainEntries([
        ['name', 'bee-queue'],
        ['settings', expect.any(Object)]
      ]);
    expect(service.settings).toBeObject().toContainEntry(['prefix', 'test-prefix']);
  });
  it('should have methods', () => {
    expect(service).toBeObject().toContainKeys(['methods']);
    expect(service.methods)
      .toBeObject()
      .toContainEntries([
        ['createJob', expect.any(Function)],
        ['getQueue', expect.any(Function)]
      ]);
  });
});
