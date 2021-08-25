![Moleculer logo](http://moleculer.services/images/banner.png)

# moleculer-bee-queue [![NPM version](https://img.shields.io/npm/v/@d0whc3r/moleculer-bee-queue.svg)](https://www.npmjs.com/package/@d0whc3r/moleculer-bee-queue)

Task queue mixin for [Bee-Queue](https://github.com/bee-queue/bee-queue)

## Install

```bash
$ npm install @d0whc3r/moleculer-bee-queue --save
```

## Usage

> This addon manages job/task queue using bee-queue

### Create queue worker service

```js
let { ServiceBroker } = require("moleculer");
let { QueueService } = require("@d0whc3r/moleculer-bee-queue");

// Create broker
let broker = new ServiceBroker({ logger: console });

// Load my service
broker.createService({
    name: "task-worker",
    mixins: [QueueService],
    queues: {
        "mail.send"(job) {
            this.logger.info("New job received!", job.data);
            job.reportProgress(10);

            return this.Promise.resolve({
                done: true,
                id: job.data.id,
                worker: process.pid
            });
        },
        "mail.send.alt": {
            ...(queue settings)
handler(job)
{
    this.logger.info("New job received!", job.data);
    job.reportProgress(10);

    return this.Promise.resolve({
        done: true,
        id: job.data.id,
        worker: process.pid
    });
}
}
}
})
;
```

### Create job in service

```js
const { ServiceBroker } = require("moleculer");
const { QueueService } = require("@d0whc3r/moleculer-bee-queue");

// Create broker
const broker = new ServiceBroker({ logger: console });

// Load my service
broker.createService({
    name: "job-maker",
    mixins: [QueueService],
    methods: {
        sendEmail(data) {
            const job = this.createJob("mail.send", payload);

            job.on("progress", (progress) => {
                this.logger.info(`Job #${job.id} progress is ${progress}%`);
            });

            job.on("succeeded", (res) => {
                this.logger.info(`Job #${job.id} completed!. Result:`, res);
            });

            job.retries(2).save();
        }
    }
});
```

## With decorators

`@Queue` decorator is implemented and could be used like (using decorators
from [@d0whc3r/moleculer-decorators](https://github.com/d0whc3r/moleculer-decorators))

### Create queue worker service

```ts
const moleculer = require('moleculer');
const { Service } = require('moleculer-decorators');
const { QueueService, Queue } = require("@d0whc3r/moleculer-bee-queue");
const broker = new moleculer.ServiceBroker({
    logger: console,
    logLevel: "debug",
});

@Service({
    name: "task-worker",
    mixins: [QueueService]
})
class ServiceName extends moleculer.Service {
    @Queue("mail.send", {
        ...(optional queue settings)
    })
    mailSend(job) {
        this.logger.info("New job received!", job.data);
        job.reportProgress(10);

        return this.Promise.resolve({
            done: true,
            id: job.data.id,
            worker: process.pid
        });
    }
}

broker.createService(ServiceName);
broker.start();
```

### Create job in service

```ts
const moleculer = require('moleculer');
const { Service, Method } = require('moleculer-decorators');
const { QueueService, Queue } = require("@d0whc3r/moleculer-bee-queue");
const broker = new moleculer.ServiceBroker({
    logger: console,
    logLevel: "debug",
});

@Service({
    name: "job-maker",
    mixins: [QueueService]
})
class ServiceName extends moleculer.Service {
    @Method
    sendEmail(data) {
        const job = this.createJob("mail.send", payload);

        job.on("progress", (progress) => {
            this.logger.info(`Job #${job.id} progress is ${progress}%`);
        });

        job.on("succeeded", (res) => {
            this.logger.info(`Job #${job.id} completed!. Result:`, res);
        });

        job.retries(2).save();
    }
}

broker.createService(ServiceName);
broker.start();
```

## Settings

For all optional queue settings check [bee-queue documentation](https://github.com/bee-queue/bee-queue#settings)

## Test

```
$ npm test
```

## License

The project is available under the [MIT license](https://tldrlegal.com/license/mit-license).
