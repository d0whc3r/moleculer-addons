import Moleculer, { Context, Endpoint, ServiceBroker } from 'moleculer';
import TelegramService from '../src/telegram.service';
import { Telegraf } from 'telegraf';
import MoleculerError = Moleculer.Errors.MoleculerError;
import { TelegramSendParams } from '../src/interfaces';

jest.mock('telegraf');

(Telegraf as any).mockImplementation(() => {
  return {
    telegram: {
      sendMessage: jest.fn().mockResolvedValue({})
    }
  };
});

describe('Test TelegramService', () => {
  let broker: ServiceBroker;
  let service: TelegramService;
  let endpoint: Endpoint;

  beforeEach(async () => {
    broker = new ServiceBroker({ logger: false });
    endpoint = {
      broker,
      id: Math.random().toString(36).slice(2),
      local: true,
      node: {},
      state: true
    };
    service = (broker.createService(TelegramService) as unknown) as TelegramService;
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  beforeEach(() => expect.hasAssertions());

  it('should create', () => {
    expect(service).toBeDefined();
  });

  it('should create telegram client', async () => {
    try {
      await broker.start();
      expect((service as any).telegram).toBeUndefined();
    } catch (e) {
      fail(e);
    }
  });

  describe('Started service', () => {
    beforeEach(async () => {
      await broker.start();
      await broker.waitForServices(service.name);
    });
    afterEach(async () => {
      await broker.stop();
    });

    let context: Context<TelegramSendParams, Record<string, unknown>>;
    beforeEach(() => {
      context = new Context<TelegramSendParams, Record<string, unknown>>(broker, endpoint);
      context.action = {
        name: 'telegram.send'
      };
    });

    it('should call postMessage', async () => {
      context.params = {
        message: 'sample message'
      };
      try {
        const response = await service.sendMessage(context);
        expect(response).toBeDefined().toBeArray().toHaveLength(1);
        expect(Telegraf).toHaveBeenCalled().toHaveBeenCalledTimes(1).toHaveBeenCalledWith(process.env.TELEGRAM_TOKEN);
        expect((service as any).telegram).toBeDefined();
        expect((service as any).telegram.telegram.sendMessage)
          .toHaveBeenCalled()
          .toHaveBeenCalledTimes(1)
          .toBeCalledWith(process.env.TELEGRAM_CHANNEL, context.params.message, service.settings.telegramExtraInfo);
      } catch (e) {
        fail(e);
      }
    });

    it('should call postMessage with token', async () => {
      context.params = {
        message: 'sample message2',
        token: 'other token'
      };
      try {
        const response = await service.sendMessage(context);
        expect(response).toBeDefined().toBeArray().toHaveLength(1);
        expect(Telegraf).toHaveBeenCalled().toHaveBeenCalledTimes(1).toHaveBeenCalledWith(context.params.token);
        expect((service as any).telegram).toBeDefined();
        expect((service as any).telegram.telegram.sendMessage)
          .toHaveBeenCalled()
          .toHaveBeenCalledTimes(1)
          .toBeCalledWith(process.env.TELEGRAM_CHANNEL, context.params.message, service.settings.telegramExtraInfo);
      } catch (e) {
        fail(e);
      }
    });

    it('should call postMessage with channel', async () => {
      context.params = {
        message: 'sample message2',
        channel: 'aChannel'
      };
      try {
        const response = await service.sendMessage(context);
        expect(response).toBeDefined().toBeArray().toHaveLength(1);
        expect(Telegraf).toHaveBeenCalled().toHaveBeenCalledTimes(1).toHaveBeenCalledWith(process.env.TELEGRAM_TOKEN);
        expect((service as any).telegram).toBeDefined();
        expect((service as any).telegram.telegram.sendMessage)
          .toHaveBeenCalled()
          .toHaveBeenCalledTimes(1)
          .toBeCalledWith(context.params.channel, context.params.message, service.settings.telegramExtraInfo);
      } catch (e) {
        fail(e);
      }
    });

    it('should call postMessage with extra', async () => {
      context.params = {
        message: 'sample message2',
        extra: {
          parse_mode: 'Markdown'
        }
      };
      try {
        const response = await service.sendMessage(context);
        expect(response).toBeDefined().toBeArray().toHaveLength(1);
        expect(Telegraf).toHaveBeenCalled().toHaveBeenCalledTimes(1).toHaveBeenCalledWith(process.env.TELEGRAM_TOKEN);
        expect((service as any).telegram).toBeDefined();
        expect((service as any).telegram.telegram.sendMessage)
          .toHaveBeenCalled()
          .toHaveBeenCalledTimes(1)
          .toBeCalledWith(process.env.TELEGRAM_CHANNEL, context.params.message, context.params.extra);
      } catch (e) {
        fail(e);
      }
    });

    it('should call postMessage twice', async () => {
      context.params = {
        message: 'sample message3'
      };
      try {
        await service.sendMessage(context);
        const response = await service.sendMessage(context);
        expect(response).toBeDefined().toBeArray().toHaveLength(1);
        expect(Telegraf).toHaveBeenCalled().toHaveBeenCalledTimes(1).toHaveBeenCalledWith(process.env.TELEGRAM_TOKEN);
        expect((service as any).telegram).toBeDefined();
        expect((service as any).telegram.telegram.sendMessage)
          .toHaveBeenCalled()
          .toHaveBeenCalledTimes(2)
          .toBeCalledWith(process.env.TELEGRAM_CHANNEL, context.params.message, service.settings.telegramExtraInfo);
      } catch (e) {
        fail(e);
      }
    });

    it('should call postMessage in two channels as string', async () => {
      context.params = {
        message: 'sample message4',
        channel: 'channel1,channel2'
      };
      try {
        const response = await service.sendMessage(context);
        expect(response).toBeDefined().toBeArray().toHaveLength(2);
        expect(Telegraf).toHaveBeenCalled().toHaveBeenCalledTimes(1).toHaveBeenCalledWith(process.env.TELEGRAM_TOKEN);
        expect((service as any).telegram).toBeDefined();
        expect((service as any).telegram.telegram.sendMessage)
          .toHaveBeenCalled()
          .toHaveBeenCalledTimes(2)
          .toBeCalledWith('channel1', context.params.message)
          .toBeCalledWith('channel2', context.params.message, service.settings.telegramExtraInfo);
      } catch (e) {
        fail(e);
      }
    });

    it('should call postMessage in two channels as array', async () => {
      context.params = {
        message: 'sample message5',
        channel: ['channel1', 'channel2']
      };
      try {
        const response = await service.sendMessage(context);
        expect(response).toBeDefined().toBeArray().toHaveLength(2);
        expect(Telegraf).toHaveBeenCalled().toHaveBeenCalledTimes(1).toHaveBeenCalledWith(process.env.TELEGRAM_TOKEN);
        expect((service as any).telegram).toBeDefined();
        expect((service as any).telegram.telegram.sendMessage)
          .toHaveBeenCalled()
          .toHaveBeenCalledTimes(2)
          .toBeCalledWith('channel1', context.params.message)
          .toBeCalledWith('channel2', context.params.message, service.settings.telegramExtraInfo);
      } catch (e) {
        fail(e);
      }
    });

    describe('Errors', () => {
      afterEach(() => {
        service.settings.telegramToken = process.env.TELEGRAM_TOKEN;
        service.settings.telegramChannel = process.env.TELEGRAM_CHANNEL;
      });

      it('Error token not defined', async () => {
        service.settings.telegramToken = undefined;
        context.params = {
          message: 'sample message'
        };
        try {
          await service.sendMessage(context);
        } catch (err) {
          expect(err).toBeInstanceOf(MoleculerError);
          expect(err.message).toBe('UNKNOWN TOKEN (set TELEGRAM_TOKEN env variable or specify "token" in action)');
          expect(err.code).toBe(500);
        }
      });

      it('Error channel not defined', async () => {
        service.settings.telegramChannel = undefined;
        context.params = {
          message: 'sample message'
        };
        try {
          await service.sendMessage(context);
        } catch (err) {
          expect(err).toBeInstanceOf(MoleculerError);
          expect(err.message).toBe(
            'UNKNOWN CHANNEL (set TELEGRAM_CHANNEL env variable or specify "channel" in action; it could be a simple string, and for multi channel: a string separated by commas or an array)'
          );
          expect(err.code).toBe(500);
        }
      });

      it('Error in telegram message', async () => {
        (Telegraf as any).mockImplementation(() => {
          return {
            telegram: {
              sendMessage: jest.fn().mockRejectedValue({ message: 'errMessage', detail: 'errDetail' })
            }
          };
        });
        context.params = {
          message: 'sample message'
        };
        try {
          await service.sendMessage(context);
        } catch (err) {
          expect(err).toBeInstanceOf(MoleculerError);
          expect(err.message).toBe('[telegram] Error in send message to "TestChannel1": errMessage (errDetail)');
          expect(err.code).toBe(500);
        }
      });
    });
  });
});
