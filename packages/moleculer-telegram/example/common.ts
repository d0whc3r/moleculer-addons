import { ServiceBroker } from 'moleculer';

export default (TelegramService: any) => {
  const broker = new ServiceBroker({
    logger: {
      type: 'Console'
    },
    logLevel: 'debug'
  });

  broker.createService({
    name: 'telegramService',
    mixins: [TelegramService],
    settings: {
      telegramToken: process.env.TELEGRAM_TOKEN,
      telegramChannel: process.env.TELEGRAM_CHANNEL,
      telegramExtraInfo: {
        parse_mode: 'Markdown',
        disable_web_page_preview: true
      }
    }
  });

  return broker;
};
