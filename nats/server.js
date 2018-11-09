const {Server} = require('../model')
const nats = require('nats')

class NatsServer extends Server {
    static connect(url, token) {
        if (token) {
            return new NatsServer(url, token)
        } else if (url) {
            return new NatsServer(url)
        } else {
            return new NatsServer('nats://localhost:4222')
        }
    }

    constructor(url, token) {
        super()
        if (token != null) {
            this._client = nats.connect({url:url, token:token})
        } else {
            this._client = nats.connect({url:url})
        }

        this._workers = []
        this._eventers = []
        this._queue = false
    }

    /**
     * Set if we should use nats queues or not.
     * @param {Boolean} queue use queues, or not.
     */
    setQueue(queue) {
        this._queue = queue
    }

    /**
     * Register a worker function.
     * @param {String} func topic to listen to.
     * @param {Function(Message):Message} handler a function that takes a Message, and returns a Message.
     */
    registerWorker(func, handler) {
        this._workers.push({topic:func, handler:handler})
    }

    /**
     * Register an eventer function.
     * @param {String} func topic to listen to.
     * @param {Function(Message)} handler a function that takes a Message and does not return anything.
     */
    registerEventer(func, handler) {
        this._eventers.push({topic:func, handler:handler})
    }

    /**
     * Tell the server to start serving RPC requests.
     * @param {String} appname the appname (will be used as queue when setQueue(true)).
     */
    start(appname) {
        this._workers.forEach(w => {
            if (this._queue) {
                this._client.subscribe(w.topic, {'queue':appname}, this._worker(w.handler))
            } else {
                this._client.subscribe(w.topic, this._worker(w.handler))
            }
        })

        this._eventers.forEach(e => {
            if (this._queue) {
                this._client.subscribe(e.topic, {'queue':appname}, this._eventer(e.handler))
            } else {
                this._client.subscribe(e.topic, this._eventer(e.handler))
            }
        })

        console.log('Nats RPC server started.')
    }

    _worker(delegate) {
        return (msg, reply, topic) => {
            let message = JSON.parse(msg)
            let response = delegate(message)
            this._client.publish(reply, JSON.stringify(response))
        }
    }

    _eventer(delegate) {
        return (msg, reply, topic) => {
            let message = JSON.parse(msg)
            delegate(message)
        }
    }
}

module.exports = NatsServer