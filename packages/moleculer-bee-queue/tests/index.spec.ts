import { ServiceBroker } from 'moleculer';
import BeeQueue from 'bee-queue';
import { BeeQueueTestService } from './bee-queue-test.service';
import { _BeeQueue } from '../src/bee-queue.service';

jest.mock('bee-queue');

(BeeQueue as any).mockImplementation(() => {
  return {
    createJob: jest.fn().mockResolvedValue(true),
    BeeQueue: jest.fn()
  };
});

describe('Test BeeQueueMixin', () => {
  let broker: ServiceBroker;
  let service: BeeQueueTestService;
  // let endpoint: Endpoint;

  beforeEach(async () => {
    broker = new ServiceBroker({ logger: false });
    // endpoint = {
    //   broker,
    //   id: Math.random().toString(36).slice(2),
    //   local: true,
    //   node: {},
    //   state: true
    // };
    const _bq = _BeeQueue;
    const serv = BeeQueueTestService;
    void { _bq, serv };
    service = broker.createService(serv) as BeeQueueTestService;
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  beforeEach(() => expect.hasAssertions());

  it('should create', () => {
    expect(service).toBeDefined();
  });

  it('should create queue', async () => {
    try {
      await broker.start();
      expect((service as any).queues).toBeUndefined();
    } catch (e) {
      fail(e);
    }
  });

  // describe('Started service', () => {
  //   beforeEach(async () => {
  //     await broker.start();
  //     await broker.waitForServices(service.name);
  //   });
  //   afterEach(async () => {
  //     await broker.stop();
  //   });
  //
  //   let context: Context<SlackSendParams, Record<string, unknown>>;
  //   beforeEach(() => {
  //     context = new Context<SlackSendParams, Record<string, unknown>>(broker, endpoint);
  //     context.action = {
  //       name: 'slack.send'
  //     };
  //   });
  //
  //   it('should call postMessage', async () => {
  //     context.params = {
  //       message: 'sample message'
  //     };
  //     try {
  //       const response = await service.sendMessage(context);
  //       expect(response).toBeDefined().toBeArray().toHaveLength(1);
  //       expect(WebClient).toHaveBeenCalled().toHaveBeenCalledTimes(1).toHaveBeenCalledWith(process.env.SLACK_TOKEN);
  //       expect((service as any).slack).toBeDefined();
  //       expect((service as any).slack.chat.postMessage)
  //         .toHaveBeenCalled()
  //         .toHaveBeenCalledTimes(1)
  //         .toBeCalledWith({ text: context.params.message, channel: process.env.SLACK_CHANNEL });
  //     } catch (e) {
  //       fail(e);
  //     }
  //   });
  //
  //   it('should call postMessage with token', async () => {
  //     context.params = {
  //       message: 'sample message2',
  //       token: 'other token'
  //     };
  //     try {
  //       const response = await service.sendMessage(context);
  //       expect(response).toBeDefined().toBeArray().toHaveLength(1);
  //       expect(WebClient).toHaveBeenCalled().toHaveBeenCalledTimes(1).toHaveBeenCalledWith(context.params.token);
  //       expect((service as any).slack).toBeDefined();
  //       expect((service as any).slack.chat.postMessage)
  //         .toHaveBeenCalled()
  //         .toHaveBeenCalledTimes(1)
  //         .toBeCalledWith({ text: context.params.message, channel: process.env.SLACK_CHANNEL });
  //     } catch (e) {
  //       fail(e);
  //     }
  //   });
  //
  //   it('should call postMessage with channel', async () => {
  //     context.params = {
  //       message: 'sample message2',
  //       channel: 'aChannel'
  //     };
  //     try {
  //       const response = await service.sendMessage(context);
  //       expect(response).toBeDefined().toBeArray().toHaveLength(1);
  //       expect(WebClient).toHaveBeenCalled().toHaveBeenCalledTimes(1).toHaveBeenCalledWith(process.env.SLACK_TOKEN);
  //       expect((service as any).slack).toBeDefined();
  //       expect((service as any).slack.chat.postMessage)
  //         .toHaveBeenCalled()
  //         .toHaveBeenCalledTimes(1)
  //         .toBeCalledWith({ text: context.params.message, channel: context.params.channel });
  //     } catch (e) {
  //       fail(e);
  //     }
  //   });
  //
  //   it('should call postMessage twice', async () => {
  //     context.params = {
  //       message: 'sample message3'
  //     };
  //     try {
  //       await service.sendMessage(context);
  //       const response = await service.sendMessage(context);
  //       expect(response).toBeDefined().toBeArray().toHaveLength(1);
  //       expect(WebClient).toHaveBeenCalled().toHaveBeenCalledTimes(1).toHaveBeenCalledWith(process.env.SLACK_TOKEN);
  //       expect((service as any).slack).toBeDefined();
  //       expect((service as any).slack.chat.postMessage)
  //         .toHaveBeenCalled()
  //         .toHaveBeenCalledTimes(2)
  //         .toBeCalledWith({ text: context.params.message, channel: process.env.SLACK_CHANNEL });
  //     } catch (e) {
  //       fail(e);
  //     }
  //   });
  //
  //   it('should call postMessage in two channels as string', async () => {
  //     context.params = {
  //       message: 'sample message4',
  //       channel: 'channel1,channel2'
  //     };
  //     try {
  //       const response = await service.sendMessage(context);
  //       expect(response).toBeDefined().toBeArray().toHaveLength(2);
  //       expect(WebClient).toHaveBeenCalled().toHaveBeenCalledTimes(1).toHaveBeenCalledWith(process.env.SLACK_TOKEN);
  //       expect((service as any).slack).toBeDefined();
  //       expect((service as any).slack.chat.postMessage)
  //         .toHaveBeenCalled()
  //         .toHaveBeenCalledTimes(2)
  //         .toBeCalledWith({ text: context.params.message, channel: 'channel1' })
  //         .toBeCalledWith({ text: context.params.message, channel: 'channel2' });
  //     } catch (e) {
  //       fail(e);
  //     }
  //   });
  //
  //   it('should call postMessage in two channels as array', async () => {
  //     context.params = {
  //       message: 'sample message5',
  //       channel: ['channel1', 'channel2']
  //     };
  //     try {
  //       const response = await service.sendMessage(context);
  //       expect(response).toBeDefined().toBeArray().toHaveLength(2);
  //       expect(WebClient).toHaveBeenCalled().toHaveBeenCalledTimes(1).toHaveBeenCalledWith(process.env.SLACK_TOKEN);
  //       expect((service as any).slack).toBeDefined();
  //       expect((service as any).slack.chat.postMessage)
  //         .toHaveBeenCalled()
  //         .toHaveBeenCalledTimes(2)
  //         .toBeCalledWith({ text: context.params.message, channel: 'channel1' })
  //         .toBeCalledWith({ text: context.params.message, channel: 'channel2' });
  //     } catch (e) {
  //       fail(e);
  //     }
  //   });
  //
  //   describe('Errors', () => {
  //     afterEach(() => {
  //       service.settings.slackToken = process.env.SLACK_TOKEN;
  //       service.settings.slackChannel = process.env.SLACK_CHANNEL;
  //     });
  //
  //     it('Error token not defined', async () => {
  //       service.settings.slackToken = undefined;
  //       context.params = {
  //         message: 'sample message'
  //       };
  //       try {
  //         await service.sendMessage(context);
  //       } catch (err) {
  //         expect(err).toBeInstanceOf(MoleculerError);
  //         expect(err.message).toBe('UNKNOWN TOKEN (set SLACK_TOKEN env variable or specify "token" in action)');
  //         expect(err.code).toBe(500);
  //       }
  //     });
  //
  //     it('Error channel not defined', async () => {
  //       service.settings.slackChannel = undefined;
  //       context.params = {
  //         message: 'sample message'
  //       };
  //       try {
  //         await service.sendMessage(context);
  //       } catch (err) {
  //         expect(err).toBeInstanceOf(MoleculerError);
  //         expect(err.message).toBe(
  //           'UNKNOWN CHANNEL (set SLACK_CHANNEL env variable or specify "channel" in action; it could be a simple string, and for multi channel: a string separated by commas or an array)'
  //         );
  //         expect(err.code).toBe(500);
  //       }
  //     });
  //
  //     it('Error in slack message', async () => {
  //       (WebClient as any).mockImplementation(() => {
  //         return {
  //           chat: {
  //             postMessage: jest.fn().mockRejectedValue({ message: 'errMessage', detail: 'errDetail' })
  //           }
  //         };
  //       });
  //       context.params = {
  //         message: 'sample message'
  //       };
  //       try {
  //         await service.sendMessage(context);
  //       } catch (err) {
  //         expect(err).toBeInstanceOf(MoleculerError);
  //         expect(err.message).toBe('[slack] Error in send message to "TestChannel1": errMessage (errDetail)');
  //         expect(err.code).toBe(500);
  //       }
  //     });
  //   });
  // });
});
