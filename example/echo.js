const {Server} = require('../')

const c = Server.connect()
c.setQueue(true)
c.registerWorker('echo', msg => {
    msg.metadata['result'] = 'success'
    return msg
})
c.start("test")