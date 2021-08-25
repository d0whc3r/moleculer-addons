import { WebAPICallResult } from '@slack/web-api/dist/WebClient';
import { BeeQueueMixin } from '../../src';
import { SlackSendParams } from '../../src/interfaces';
import { config } from 'dotenv';
import common from '../common';

config();

console.log('Running from src folder');

const broker = common(BeeQueueMixin);

void broker.start().then(() => {
  broker
    .call<WebAPICallResult[], SlackSendParams>('slackService.send', { message: 'testing!' })
    .then((response) => {
      console.log('[src] Slack message response', response);
    })
    .catch(console.error);
});
