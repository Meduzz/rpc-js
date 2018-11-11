const { local, model } = require('../')

const server = new local.Server()
server.registerWorker('echo', msg => {
    return model.Message.newSuccess(msg.body)
})

const client = new local.Client(server)
let response = client.request('echo', new model.Message({}, 'Hello world!'))

console.log(response.body)