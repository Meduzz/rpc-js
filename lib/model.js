class Client {
    constructor() { }
    trigger(func, message) { }
    request(func, message) { }
}

exports.Client = Client

class Server {
    constructor() { }
    registerWorker(func, handler) { }
    registerEventer(func, handler) { }
    start(appname) { }
}

exports.Server = Server

class Message {
    constructor(meta, body) {
        this.metadata = meta
        this.body = body
    }

    addMeta(key, value) {
        this.meta[key] = value
    }

    setBody(body) {
        this.body = body
    }

    /**
     * Creates a new Message with body set to @param body.
     * @param {*} body 
     * @returns the new Message.
     */
    static newSuccess(body) {
        let meta = {
            'result': 'success'
        }
        return new Message(meta, body)
    }

    /**
     * Creates a new Message with json-body created from the error message.
     * @param {String} error the error to return to the caller.
     * @returns {Message} returns a message with the error.
     */
    static newError(error) {
        let meta = {
            'result': 'error'
        }
        let errorDTO = {
            'message': error
        }
        return new Message(meta, errorDTO)
    }

    /**
     * Create a new empty Message with a json body.
     * @returns {Message} returns an empty Message.
     */
    static newEmptyJsonBody() {
        let meta = {}
        let body = {}

        return new Message(meta, body)
    }

    /**
     * Create a new empty Message with a string body.
     * @returns {Message} returns an empty Message.
     */
    static newEmptyStringBody() {
        let meta = {}
        let body = ''

        return new Message(meta, body)
    }
}

exports.Message = Message