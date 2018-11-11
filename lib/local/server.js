const { Server } = require('../model.js')

class LocalServer extends Server {
    constructor() {
        super()
        this._workers = {}
        this._eventers = {}
    }

    registerWorker(func, handler) {
        this._workers[func] = handler
    }

    registerEventer(func, handler) {
        this._eventers[func] = handler
    }

    start(app) { }

    callWorker(func, message) {
        return this._workers[func](message)
    }

    callEventer(func, message) {
        this._eventers[func](message)
    }
}

module.exports = LocalServer