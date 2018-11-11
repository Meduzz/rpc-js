const {Client} = require('../model')
const nats = require('nats')

class NatsClient extends Client {
    static connect(url, username, password) {
        if (username) {
            return new NatsServer({url:url, user:username, pass:password})
        } else if (url) {
            return new NatsClient(url)
        } else {
            return new NatsClient('nats://localhost:4222')
        }
    }

    constructor(url, token) {
        super()
        if (token != null) {
            this._client = nats.connect({url:url, token:token})
        } else {
            this._client = nats.connect({url:url})
        }
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
        return new Promise(resolve => this._client.requestOne(func, message, {}, 3000, resolve))
    }
}

module.exports = NatsClient