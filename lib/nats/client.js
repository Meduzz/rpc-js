const { Client, Message } = require('../model')
const nats = require('nats')

class NatsClient extends Client {
    static connect(url, username, password) {
        if (username) {
            return new NatsClient({ url: url, user: username, pass: password })
        } else if (url) {
            return new NatsClient(url)
        } else {
            return new NatsClient('nats://localhost:4222')
        }
    }

    constructor(settings) {
        super()
        this._client = nats.connect(settings)
    }

    /**
     * Trigger an event.
     * @param {String} func the topic to trigger to.
     * @param {Message} message the message that contains what's triggered.
     */
    trigger(func, message) {
        this._client.publish(func, message)
    }

    /**
     * 
     * @param {String} func the topic to request to.
     * @param {Message} message a Message containing the request.
     * @returns {Promise<Message>} returns a promise with a message.
     */
    request(func, message) {
        return new Promise((resolve, reject) => {
            this._client.requestOne(func, JSON.stringify(message), {}, 3000, res => {
                if (res instanceof nats.NatsError) {
                    reject(Message.newError(res))
                } else {
                    resolve(res)
                }
            })
        })
    }
}

module.exports = NatsClient