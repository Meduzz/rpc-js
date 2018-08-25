const rpc = require('../')

rpc.connect()
    .worker("echo", (req) => {
        return {code:200, metadata:{"Content-Type":"text/plain"}, body:req.body}
    }).eventer("event", (req) => {
        console.log("There was an event.")
    }).start()