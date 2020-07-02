import { Action, Method, Service } from '@d0whc3r/moleculer-decorators';
import { TelegramSendParams, TelegramServiceOptions, TelegramServiceOptionsSettings } from './interfaces';
import moleculer, { Context, Errors } from 'moleculer';
import { Telegraf } from 'telegraf';
import { TelegrafContext } from 'telegraf/typings/context';
import { Message } from 'telegram-typings';
import { ExtraEditMessage } from 'telegraf/typings/telegram-types';
import MoleculerError = Errors.MoleculerError;

export class _TelegramService extends moleculer.Service<TelegramServiceOptionsSettings> {
  private telegram?: Telegraf<TelegrafContext>;
  private _name = 'telegram';
  private _settings: TelegramServiceOptionsSettings = {
    telegramToken: process.env.TELEGRAM_TOKEN,
    telegramChannel: process.env.TELEGRAM_CHANNEL,
    telegramExtraInfo: {
      parse_mode: 'Markdown',
      disable_web_page_preview: true
    }
  };

  public get name() {
    return this._name || 'telegram';
  }

  public set name(value: string) {
    this._name = value;
  }

  public get settings(): TelegramServiceOptionsSettings {
    return (
      this._settings || {
        telegramToken: process.env.TELEGRAM_TOKEN,
        telegramChannel: process.env.TELEGRAM_CHANNEL,
        telegramExtraInfo: {
          parse_mode: 'Markdown',
          disable_web_page_preview: true
        }
      }
    );
  }

  public set settings(value: TelegramServiceOptionsSettings) {
    this._settings = value;
  }

  @Action({
    name: 'send',
    params: {
      channel: [
        { type: 'string', optional: true },
        { type: 'array', items: 'string', optional: true }
      ],
      token: { type: 'string', optional: true },
      extra: { type: 'object', optional: true },
      message: { type: 'string' }
    }
  })
  sendMessage(ctx: Context<TelegramSendParams, Record<string, unknown>>) {
    const {
      channel = this.settings.telegramChannel,
      token = this.settings.telegramToken,
      extra = this.settings.telegramExtraInfo,
      message
    } = ctx.params;
    if (!token) {
      throw new MoleculerError('UNKNOWN TOKEN (set TELEGRAM_TOKEN env variable or specify "token" in action)');
    }
    if (!channel) {
      throw new MoleculerError(
        'UNKNOWN CHANNEL (set TELEGRAM_CHANNEL env variable or specify "channel" in action; it could be a simple string, and for multi channel: a string separated by commas or an array)'
      );
    }
    if (!this.telegram) {
      this.telegram = new Telegraf(token);
    }
    const chans = typeof channel === 'string' ? channel.split(',') : channel;
    const channels = Array.isArray(chans) ? chans : [chans];
    return Promise.all(this.sendMessageToChannels(message, channels, extra));
  }

  @Method
  private sendMessageToChannels(text: string, channels: string[], extra: ExtraEditMessage = {}) {
    if (!this.telegram) {
      return [Promise.reject('Telegram api not initiated')];
    }
    const promises: Promise<Message>[] = [];
    channels.forEach((channel) => {
      const promise = this.telegram?.telegram
        .sendMessage(channel, text, extra)
        .then((response) => {
          this.logger.debug(`[telegram] Message sent to "${channel}"`);
          return response;
        })
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/restrict-template-expressions
        .catch((err) => Promise.reject(new MoleculerError(`[telegram] Error in send message to "${channel}": ${err.message} (${err.detail})`)));
      if (promise) {
        promises.push(promise);
      }
    });
    return promises;
  }
}

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
export default class TelegramAsService extends _TelegramService {}
