import { Options } from '@d0whc3r/moleculer-decorators';
import { ServiceSettingSchema } from 'moleculer';

export interface TelegramServiceOptionsSettings extends ServiceSettingSchema {
  slackToken?: string;
  slackChannel?: string | string[];
}

export interface TelegramServiceOptions extends Options {
  name: 'slack';
  settings: TelegramServiceOptionsSettings;
}

export interface TelegramSendParams {
  channel?: TelegramServiceOptionsSettings['slackChannel'];
  token?: TelegramServiceOptionsSettings['slackToken'];
  message: string;
}
