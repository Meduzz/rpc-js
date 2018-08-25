const nats = require('nats')

class Builder {

    static connect(url, token) {
        if (token) {
            return new Builder(url, token)
        } else if (url) {
            return new Builder(url)
        } else {
            return new Builder('nats://localhost:4222')
        }
    }

    constructor(url, token) {
        if (token != null) {
            this._client = nats.connect({url:url, token:token})
        } else {
            this._client = nats.connect({url:url})
        }

        this._workers = []
        this._eventers = []
        this._rawWorker = []
        this._rawEventer = []
    }

    worker(queue, cb) {
        return this.workerGroup(queue, null, cb)
    }

    workerGroup(queue, group, cb) {
        this._workers.push(new Vo(queue, group, cb))
        return this
    }

    eventer(queue, cb) {
        return this.eventerGroup(queue, null, cb)
    }

    eventerGroup(queue, group, cb) {
        this._eventers.push(new Vo(queue, group, cb))
        return this
    }

    rawWorker(queue, cb) {
        return this.rawWorkerGroup(queue, null, cb)
    }

    rawWorkerGroup(queue, group, cb) {
        this._rawWorker.push(new Vo(queue, group, cb))
        return this
    }

    rawEventer(queue, cb) {
        return this.rawEventerGroup(queue, null, cb)
    }

    rawEventerGroup(queue, group, cb) {
        this._rawEventer.push(new Vo(queue, group, cb))
        return this
    }

    start() {
        const client = this._client
        this._workers.forEach(vo => {
            if (vo.group != null) {
                client.subscribe(vo.queue, vo.group, this._workerWrapper(vo.cb))
            } else {
                client.subscribe(vo.queue, this._workerWrapper(vo.cb))
            }
        })

        this._eventers.forEach(vo => {
            if (vo.group != null) {
                client.subscribe(vo.queue, vo.group, this.eventerGroup(vo.cb))
            } else {
                client.subscribe(vo.queue, this._eventerWrapper(vo.cb))
            }
        })

        this._rawWorker.forEach(vo => {
            if (vo.group != null) {
                client.subscribe(vo.queue, vo.group, this._rawWrapper(vo.cb))
            } else {
                client.subscribe(vo.queue, this._rawWorker(vo.cb))
            }
        })

        this._rawEventer.forEach(vo => {
            if (vo.group != null) {
                client.subscribe(vo.queue, vo.group, vo.cb)
            } else {
                client.subscribe(vo.queue, vo.cb)
            }
        })

        console.log('Started.')
    }

    _workerWrapper(cb) {
        return (msg, reply, topic) => {
            let req = JSON.parse(msg)
            let res = cb(req)
            this._client.publish(reply, JSON.stringify(res))
        }
    }

    _eventerWrapper(cb) {
        return (msg, reply, topic) => {
            let req = JSON.parse(msg)
            cb(req)
        }
    }

    _rawWrapper(cb) {
        return (msg, reply, topic) => {
            let res = cb(msg)
            this._client.publish(reply, res)
        }
    }
}

module.exports = Builder

class Vo {
    constructor(queue, group, cb) {
        this.queue = queue
        this.group = group
        this.cb = cb
    }
}
