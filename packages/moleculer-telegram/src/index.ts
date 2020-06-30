import { Action, Method, Service } from '@d0whc3r/moleculer-decorators';
import { TelegramSendParams, TelegramServiceOptions, TelegramServiceOptionsSettings } from './interfaces';
import moleculer from 'moleculer';
import Moleculer, { Context } from 'moleculer';
import { Telegraf } from 'telegraf';
import { TelegrafContext } from 'telegraf/typings/context';

import MoleculerError = Moleculer.Errors.MoleculerError;

@Service<TelegramServiceOptions>({
  name: 'telegram',
  settings: {
    telegramToken: process.env.TELEGRAM_TOKEN,
    telegramChannel: process.env.TELEGRAM_CHANNEL,
    telegramExtraInfo: {
      parse_mode: 'Markdown',
      disable_web_page_preview: true
    }
  }
})
export default class TelegramService extends moleculer.Service<TelegramServiceOptionsSettings> {
  private telegram?: Telegraf<TelegrafContext>;

  @Action({
    name: 'send',
    params: {
      channel: [
        { type: 'string', optional: true },
        { type: 'array', items: 'string', optional: true }
      ],
      token: { type: 'string', optional: true },
      message: { type: 'string' }
    }
  })
  sendMessage(ctx: Context<TelegramSendParams, Record<string, unknown>>) {
    const { channel = this.settings.telegramChannel, token = this.settings.telegramToken, message } = ctx.params;
    if (!token) {
      throw new MoleculerError('UNKNOWN TOKEN (set TELEGRAM_TOKEN env variable or specify "token" in action)');
    }
    if (!channel) {
      throw new MoleculerError('UNKNOWN CHANNEL (set TELEGRAM_CHANNEL env variable or specify "channel" in action; it could be a simple string, and for multi channel: a string separated by commas or an array)');
    }
    if (!this.telegram) {
      this.telegram = new Telegraf(token);
    }
    if (!this.telegram) {
      throw new MoleculerError('[telegram] Error in initiate telegram api sdk')
    }
    const chans = typeof channel === 'string' ? channel.split(',') : channel;
    const channels = Array.isArray(chans) ? chans : [chans];
    return this.sendMessageToChannels(message, channels);
  }

  @Method
  private sendMessageToChannels(text: string, channels: string[]) {
    channels.forEach((channel) => {
      this.telegram?.telegram.sendMessage(channel, text)
        .then((response) => {
          this.logger.debug(`[telegram] Message sent to "${channel}"`);
          return response;
        })
        .catch((err) => Promise.reject(new MoleculerError(`[telegram] Error in send message to "${channel}": ${err.message} (${err.detail})`)));
    });
  }

}
