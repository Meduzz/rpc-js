const {nats, model} = require('../')

const c = nats.Server.connect()
c.setQueue(true)
c.registerWorker('echo', msg => {
    let m = model.Message.newSuccess(msg.body)
    return m
})
c.start("test")