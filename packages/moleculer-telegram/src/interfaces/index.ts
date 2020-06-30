import { Options } from '@d0whc3r/moleculer-decorators';
import { ServiceSettingSchema } from 'moleculer';
import { ExtraEditMessage } from 'telegraf/typings/telegram-types';

export interface TelegramServiceOptionsSettings extends ServiceSettingSchema {
  telegramToken?: string;
  telegramChannel?: string | string[];
  telegramExtraInfo?: ExtraEditMessage;
}

export interface TelegramServiceOptions extends Options {
  name: 'telegram';
  settings: TelegramServiceOptionsSettings;
}

export interface TelegramSendParams {
  channel?: TelegramServiceOptionsSettings['telegramChannel'];
  token?: TelegramServiceOptionsSettings['telegramToken'];
  extra?: TelegramServiceOptionsSettings['telegramExtraInfo'];
  message: string;
}
