import { ServiceBroker } from 'moleculer';
import { BeeQueueServiceOptionsSettings } from '../src/interfaces';

export default (beeQueueService: any, settings?: BeeQueueServiceOptionsSettings) => {
  const broker = new ServiceBroker({
    logger: {
      type: 'Console'
    },
    logLevel: 'debug'
  });

  broker.createService({
    name: 'beeQueueService',
    mixins: [beeQueueService(settings)]
  });

  return broker;
};
