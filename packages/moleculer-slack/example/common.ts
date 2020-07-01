import { ServiceBroker } from 'moleculer';

export default (SlackService: any) => {
  const broker = new ServiceBroker({
    logger: {
      type: 'Console'
    },
    logLevel: 'debug'
  });

  broker.createService({
    name: 'slackService',
    mixins: [SlackService],
    settings: {
      slackToken: process.env.SLACK_TOKEN,
      slackChannel: process.env.SLACK_CHANNEL
    }
  });

  return broker;
};
