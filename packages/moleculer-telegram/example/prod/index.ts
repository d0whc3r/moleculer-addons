import { TelegramService, TelegramSendParams } from '../../dist';
import { config } from 'dotenv';
import common from '../common';
import * as tt from 'telegraf/typings/telegram-types';

config();

console.log('Running from dist folder');

const broker = common(TelegramService);

void broker.start().then(() => {
  broker
    .call<tt.Message[], TelegramSendParams>('telegramService.send', { message: 'testing!' })
    .then((response) => {
      console.log('[dist] Telegram message response', response);
    })
    .catch(console.error);
});
