![Moleculer logo](http://moleculer.services/images/banner.png)

# moleculer-slack [![NPM version](https://img.shields.io/npm/v/@d0whc3r/moleculer-slack.svg)](https://www.npmjs.com/package/@d0whc3r/moleculer-slack)

Send Messages to Slack API.

## Install

```bash
$ npm install @d0whc3r/moleculer-slack --save
```

## Usage

> This addon reads the `SLACK_TOKEN` and `SLACK_CHANNEL` environment variables, but all are optional

```js
let { ServiceBroker } = require("moleculer");
let { SlackService } = require("@d0whc3r/moleculer-slack");

// Create broker
let broker = new ServiceBroker({ logger: console });

// Load my service
broker.createService({
    name: "slack",
    mixins: [SlackService]
});

// Start server
broker.start().then(() => {
  broker
    .call('slackService.send', { message: 'testing!' })
    .then((response) => {
      console.log('Slack message response', response);
    })
    .catch(console.error);
});
```

## Settings

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `slackToken` | `String` | `SLACK_TOKEN env variable` | Slack API Token. Visit your [Slack App dashboard's](https://www.slack.com/apps) main page. Click "Create App, Generate Token", then copy and paste your "API TOKEN" here. |
| `slackChannel` | `String` | `SLACK_CHANNEL env variable` | Slack API Token. Visit your [Slack App dashboard's](https://www.slack.com/apps) main page. Add incoming webhook and create/select a channel, then copy and paste here. |

## Actions
### `send` 

Send a Slack Message

#### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `message` | `String` | **required** | Message text |
| `channel` | `String` | `null` | (optional) Channel name, can be array or string, if it is a string it could be multiple channels separated by commas |
| `token` | `String` | `null` | (optional) Token to use |

#### Results
**Type:** `Promise<WebAPICallResult[]>`

## Methods

### `sendMessageToChannels` 

Send a slack message to one or more channels

#### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `message` | `String` | - | Body of the message |
| `channel` | `String or Array<String>` | - | Channel or channels name/s |

#### Results
**Type:** `Promise<WebAPICallResult>[]`

## Test
```
$ npm test
```

## License
The project is available under the [MIT license](https://tldrlegal.com/license/mit-license).
