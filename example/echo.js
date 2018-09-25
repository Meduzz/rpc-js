const rpc = require('../')

rpc.connect()
    .workerGroup("echo", "example", (req) => {
        return {code:200, metadata:{"Content-Type":"text/plain"}, body:req.body}
    }).start()