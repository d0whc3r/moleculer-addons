import { Action, Method, Service } from '@d0whc3r/moleculer-decorators';
import { TelegramSendParams, TelegramServiceOptions, TelegramServiceOptionsSettings } from './interfaces';
import moleculer from 'moleculer';
import Moleculer, { Context } from 'moleculer';
import { WebClient } from '@slack/web-api';
import MoleculerError = Moleculer.Errors.MoleculerError;

@Service<TelegramServiceOptions>({
  name: 'slack',
  settings: {
    slackToken: process.env.SLACK_TOKEN,
    slackChannel: process.env.SLACK_CHANNEL
  }
})
export default class TelegramService extends moleculer.Service<TelegramServiceOptionsSettings> {
  private slack?: WebClient;

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
    const { channel = this.settings.slackChannel, token = this.settings.slackToken, message } = ctx.params;
    if (!token) {
      throw new MoleculerError('UNKNOWN TOKEN (set SLACK_TOKEN env variable or specify "token" in action)');
    }
    if (!channel) {
      throw new MoleculerError(
        'UNKNOWN CHANNEL (set SLACK_CHANNEL env variable or specify "channel" in action; it could be a simple string, and for multi channel: a string separated by commas or an array)');
    }
    if (!this.slack) {
      this.slack = new WebClient(token);
    }
    if (!this.slack) {
      throw new MoleculerError('[slack] Error in initiate slack api sdk');
    }
    const chans = typeof channel === 'string' ? channel.split(',') : channel;
    const channels = Array.isArray(chans) ? chans : [chans];
    return this.sendMessageToChannels(message, channels);
  }

  @Method
  private sendMessageToChannels(text: string, channels: string[]) {
    channels.forEach((channel) => {
      this.slack!.chat.postMessage({ text, channel })
        .then((response) => {
          this.logger.debug(`[slack] Message sent to "${channel}", metadata: ${JSON.stringify(response.response_metadata)}`);
          return response;
        })
        .catch((err) => Promise.reject(new MoleculerError(`[slack] Error in send message to "${channel}": ${err.message} (${err.detail})`)));
    });
  }

}
