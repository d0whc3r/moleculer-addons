import { WebAPICallResult } from '@slack/web-api/dist/WebClient';
import { SlackService, SlackSendParams } from '../../dist';
import { config } from 'dotenv';
import common from '../common';

config();

console.log('Running from dist folder');

const broker = common(SlackService);

void broker.start().then(() => {
  broker
    .call<WebAPICallResult[], SlackSendParams>('slackService.send', { message: 'testing!' })
    .then((response) => {
      console.log('[dist] Slack message response', response);
    })
    .catch(console.error);
});
