const assert = require('assert')
const { model, nats } = require('../')

describe("rpc", () => {
    describe(" - can be setup", () => {
        let rpc = nats.connect()
        let msgs = []

        it("can be setup", () => {
            rpc.handle("echo", null, (ctx) => {
                ctx.reply(ctx.body())
            })

            rpc.handle("test", null, (ctx) => {
                msgs.push(ctx.body())
            })

            rpc.handle("forward", null, (ctx) => {
                ctx.forward("echo", ctx.body())
            })
        })

        it("can be started", () => {
            rpc.start('test')
        })

        it("can handle requests", async () => {
            let reply = await rpc.request("echo", model.Message.newEmptyStringBody())

            assert(reply != null, 'reply was empty')
        })

        it("can handle triggers", async () => {
            let i = await rpc.trigger("test", model.Message.newEmptyStringBody())

            assert(msgs.length == 1)
        })

        it("can forward", async () => {
            let reply = await rpc.request("forward", model.Message.newEmptyStringBody())

            assert(reply != null, 'reply was empty')
        })
    })
})