import { Options } from '@d0whc3r/moleculer-decorators';
import { ServiceSettingSchema } from 'moleculer';

export interface SlackServiceOptionsSettings extends ServiceSettingSchema {
  slackToken?: string;
  slackChannel?: string | string[];
}

export interface SlackServiceOptions extends Options {
  name: 'slack';
  settings: SlackServiceOptionsSettings;
}

export interface SlackSendParams {
  channel?: SlackServiceOptionsSettings['slackChannel'];
  token?: SlackServiceOptionsSettings['slackToken'];
  message: string;
}
