import { config } from 'dotenv';
import common from '../common';
import { TelegramService } from '../../src';
import { TelegramSendParams } from '../../src/interfaces';
import { Message } from 'telegraf/typings/core/types/typegram';

config();

// eslint-disable-next-line no-console
console.log('Running from src folder');

const broker = common(TelegramService);

void broker.start().then(() => {
  broker
    .call<Message[], TelegramSendParams>('telegramService.send', { message: 'testing!' })
    .then((response) => {
      // eslint-disable-next-line no-console
      console.log('[src] Telegram message response', response);
    })
    // eslint-disable-next-line no-console
    .catch(console.error);
});
