class Client {
    constructor() {}
    trigger(func, message) {}
    request(func, message) {}
}

exports.Client = Client

class Server {
    constructor() {}
    registerWorker(func, handler) {}
    registerEventer(func, handler) {}
    start(appname) {}
}

exports.Server = Server

class Message {
    constructor(meta, body) {
        this.meta = meta
        this.body = body
    }

    addMeta(key, value) {
        this.meta[key] = value
    }

    setBody(body) {
        this.body = body
    }

    static newMessage(body) {
        let meta = {
            'result':'success'
        }
        return new Message(meta, body)
    }

    static newErrorMessage(error) {
        let meta = {
            'result':'error'
        }
        let errorDTO = {
            'message':error
        }
        return new Message(meta, errorDTO)
    }
}

exports.Message = Message