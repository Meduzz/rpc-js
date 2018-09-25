# rpc-js

The whole plan is to make it easy to do rpc or just events with nats. The base concept is that workers will do rpc style message handling. While eventers will only accepts payloads, but not return anything.

## Workers

This is the base of rpc, these callback handle requests, messages that expect an answer. Callbacks wired up with the worker or workerGroup should expect messages to have the following structure.

```
{
    metadata:{<bunch of headers>},
    body:<base64 encoded string>
}
```

The worker and workerGroup functions are expecting your callback to return the following json.

```
{
    code:<http status code>
    metadata:{<headers needed to serve the response>},
    body:<base64 encoded string>
}
```

The rawWorker and rawWorkerGroup function will get the raw message, directly from the queue. It's expected that the callback returns something to send to the reply queue. (Since it was a request)

## Eventers

Eventers are on the other hand not expected to generate a reply, only to deal with the request. Lets call it normal messaging. The eventer and eventerGroup, like the worker accepts an event originating from a http request.

RawEventers on the other hand will be served the raw event sent to the topic they were bound to.

# What's up with the group (in workerGroup, eventerGroup)

Nats offer us to create groups of subscribers, all traffic is split between the subscribers in that group. While ungrouped subscribers will all receive all traffic.

# An example

This example will echo what ever got sent to the topic echo.

```
const rpc = require('@chimps/js-rpc')

rpc.connect()
    .worker("echo", (req) => {
        return {code:200, metadata:{"Content-Type":"text/plain"}, body:req.body}
    }).eventer("event", (req) => {
        console.log("There was an event.")
    }).start()
```