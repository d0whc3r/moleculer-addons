![Moleculer logo](http://moleculer.services/images/banner.png)

# moleculer-telegram [![NPM version](https://img.shields.io/npm/v/@d0whc3r/moleculer-telegram.svg)](https://www.npmjs.com/package/@d0whc3r/moleculer-telegram)

Send Messages to Telegram API.

## Install

```bash
$ npm install @d0whc3r/moleculer-telegram --save
```

## Usage

> This addon reads the `TELEGRAM_TOKEN` and `TELEGRAM_CHANNEL` environment variables, but all are optional

```js
let { ServiceBroker } = require("moleculer");
let { TelegramService } = require("@d0whc3r/moleculer-telegram");

// Create broker
let broker = new ServiceBroker({ logger: console });

// Load my service
broker.createService({
    name: "telegram",
    mixins: [TelegramService]
});

// Start server
broker.start().then(() => {
  broker
    .call('telegram.send', { message: 'testing!' })
    .then((response) => {
      console.log('Telegram message response', response);
    })
    .catch(console.error);
});
```

## Settings

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `telegramToken` | `String` | `TELEGRAM_TOKEN env variable` | Telegram API Token. |
| `telegramChannel` | `String` | `TELEGRAM_CHANNEL env variable` | Telegram API Token. |

## Actions
### `send` 

Send a Telegram Message

#### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `message` | `String` | **required** | Message text |
| `channel` | `String` | `null` | (optional) Channel name, can be array or string, if it is a string it could be multiple channels separated by commas |
| `token` | `String` | `null` | (optional) Token to use |

#### Results
**Type:** `Promise<tt.Message[]>`

## Methods

### `sendMessageToChannels` 

Send a telegram message to one or more channels

#### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `message` | `String` | - | Body of the message |
| `channel` | `String or Array<String>` | - | Channel or channels name/s |

#### Results
**Type:** `Promise<tt.Message>[]`

## Test
```
$ npm test
```

## License
The project is available under the [MIT license](https://tldrlegal.com/license/mit-license).
