import { config } from 'dotenv';
import common from '../common';
import * as tt from 'telegraf/typings/telegram-types';
import { TelegramService } from '../../src';
import { TelegramSendParams } from '../../src/interfaces';

config();

console.log('Running from src folder');

const broker = common(TelegramService);

void broker.start().then(() => {
  broker
    .call<tt.Message[], TelegramSendParams>('telegramService.send', { message: 'testing!' })
    .then((response) => {
      console.log('[src] Telegram message response', response);
    })
    .catch(console.error);
});
