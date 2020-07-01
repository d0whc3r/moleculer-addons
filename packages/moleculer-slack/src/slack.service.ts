import { Action, Method, Service } from '@d0whc3r/moleculer-decorators';
import { SlackSendParams, SlackServiceOptionsSettings, SlackServiceOptions } from './interfaces';
import moleculer, { Context, Errors } from 'moleculer';
import { WebClient } from '@slack/web-api';
import { WebAPICallResult } from '@slack/web-api/dist/WebClient';
import MoleculerError = Errors.MoleculerError;

export class _SlackService extends moleculer.Service<SlackServiceOptionsSettings> {
  name = 'slack';
  settings: SlackServiceOptionsSettings = {
    slackToken: process.env.SLACK_TOKEN,
    slackChannel: process.env.SLACK_CHANNEL
  };
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
  sendMessage(ctx: Context<SlackSendParams, Record<string, unknown>>) {
    const { channel = this.settings.slackChannel, token = this.settings.slackToken, message } = ctx.params;
    if (!token) {
      throw new MoleculerError('UNKNOWN TOKEN (set SLACK_TOKEN env variable or specify "token" in action)');
    }
    if (!channel) {
      throw new MoleculerError(
        'UNKNOWN CHANNEL (set SLACK_CHANNEL env variable or specify "channel" in action; it could be a simple string, and for multi channel: a string separated by commas or an array)'
      );
    }
    if (!this.slack) {
      this.slack = new WebClient(token);
    }
    const chans = typeof channel === 'string' ? channel.split(',') : channel;
    const channels = Array.isArray(chans) ? chans : [chans];
    return Promise.all(this.sendMessageToChannels(message, channels));
  }

  @Method
  private sendMessageToChannels(text: string, channels: string[]) {
    const promises: Promise<WebAPICallResult>[] = [];
    channels.forEach((channel) => {
      const promise = this.slack!.chat.postMessage({ text, channel })
        .then((response) => {
          this.logger.debug(`[slack] Message sent to "${channel}", id: ${response.ts}`);
          return response;
        })
        .catch((err) => Promise.reject(new MoleculerError(`[slack] Error in send message to "${channel}": ${err.message} (${err.detail})`)));
      promises.push(promise);
    });
    return promises;
  }
}

@Service<SlackServiceOptions>({
  name: 'slack',
  settings: {
    slackToken: process.env.SLACK_TOKEN,
    slackChannel: process.env.SLACK_CHANNEL
  }
})
export default class SlackAsService extends _SlackService {}
