# rpc-js

The whole plan is to make it easy to do rpc. The base concept is to  send and hanlde messages (over nats).

## Handler

This replaces both workers and events and combines them both into one simple context. Handlers get registered to a path with an optional group, to make them share the load of that queue.

Messages still looks like this:

```
{
    metadata:{<bunch of headers>},
    body:<up to you>
}
```

# An example

This example will echo what ever got sent to the topic echo.

```
const {nats, model} = require('../')

// connect to nats
const c = nats.Server.connect()

// bind a handler to the echo queue, expecting to be called with request.
c.handler('echo', null, ctx => {
    let m = ctx.body()
    
    ctx.reply(m)
})

c.start("test")
```

To consume the above rpc service:

```
const {nats, model} = require('../')

// connect to nats
const c = nats.Server.connect()

// request a response from echo, give it 3000 millis to respond to us.
let res = await c.request('echo', model.Message.newEmptyStringBody(), 3000)
// res will now contain a model.Message response.
```