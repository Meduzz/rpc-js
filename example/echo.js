const { nats, model } = require('../')

const rpc = nats.connect()
rpc.handle('echo', 'myqueuegroup', ctx => {
    ctx.reply(ctx.body())
})
rpc.start("test")

const reply = await rpc.request('echo', model.Message.newEmptyStringBody())