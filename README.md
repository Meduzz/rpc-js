# rpc-js

The whole plan is to make it easy to do rpc. The base concept is that workers will do rpc style message handling. While eventers will only accepts payloads, but not return anything.

## Workers

This is the base of rpc, these callback handle messages and they expect an answer. Callbacks wired up with the regierWorker should expect messages to have the following structure.

```
{
    metadata:{<bunch of headers>},
    body:<up to you>
}
```

The registerWorker function is expecting your callback to return the following json.

```
{
    metadata:{<headers needed to serve the response>},
    body:<up to you>
}
```

## Eventers

Eventers are on the other hand not expected to generate a reply, only to deal with the request. Lets call it normal messaging. The registerEventer, like the worker accepts an Message.

## Implementations
Rpc can be done over a number of transports, for now only nats is supported by this package. But there's both a server and a client part.

# An example

This example will echo what ever got sent to the topic echo.

```
const {nats, model} = require('../')

const c = nats.Server.connect()
c.setQueue(true)
c.registerWorker('echo', msg => {
    let m = model.Message.newSuccess(msg.body)
    return m
})
c.start("test")
```