const { RPC, Context } = require('../model')
const nats = require('nats')

class NatsRPC extends RPC {
    static connect(url, username, password) {
        if (username) {
            return new NatsRPC({ url: url, user: username, pass: password })
        } else if (url) {
            return new NatsRPC(url)
        } else {
            return new NatsRPC('nats://localhost:4222')
        }
    }

    constructor(settings) {
        super()
        this._client = nats.connect(settings)

        this._handlers = []
    }

    /**
     * Listen for events @ func.
     * @param {String} func the topic to listen to.
     * @param {String} group the consumer group or null
     * @param {Function(Context)=>Void} handler the function that handles any message.
     */
    handle(func, group, handler) {
        this._handlers.push({ topic: func, queue: group, handler: handler })
    }

    /**
     * Trigger an event.
     * @param {String} func the topic to trigger to.
     * @param {Message} message the message that contains what's triggered.
     * @returns {Promise<Void>} returns a promise with a message.
     */
    trigger(func, message) {
        return new Promise((resolve, reject) => {
            this._client.publish(func, JSON.stringify(message), (res) => {
                if (res instanceof nats.NatsError) {
                    reject(res)
                } else {
                    resolve()
                }
            })
        })
    }

    /**
     * 
     * @param {String} func the topic to request to.
     * @param {Message} message a Message containing the request.
     * @param {Number} timeout the timeout in milliseconds (default 3000).
     * @returns {Promise<Message>} returns a promise with a message.
     */
    request(func, message, timeout = 3000) {
        return new Promise((resolve, reject) => {
            this._client.requestOne(func, JSON.stringify(message), {}, timeout, res => {
                if (res instanceof nats.NatsError) {
                    reject(Message.newError(res))
                } else {
                    resolve(JSON.parse(res))
                }
            })
        })
    }

    /**
     * Tell the server to start serving RPC requests.
     * @param {String} appname the appname (will be used as queue when setQueue(true)).
     */
    start(appname) {
        this._handlers.forEach(w => {
            if (w.queue != null) {
                this._client.subscribe(w.topic, { 'queue': w.queue }, this._handler(w.handler))
            } else {
                this._client.subscribe(w.topic, this._handler(w.handler))
            }
        })

        console.log(`${appname} RPC server started.`)
    }

    _handler(delegate) {
        return (msg, reply, topic) => {
            let message = JSON.parse(msg)
            let context = new Context(this._client, message, reply)
            try {
                delegate(context)
            } catch (e) {
                console.log(e)
            }
        }
    }
}

module.exports = NatsRPC