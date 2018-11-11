const { Client } = require('../model.js')

class LocalClient extends Client {
    /**
     * Create a new client, calling the provided LocalServer.
     * @param {LocalServer} server 
     */
    constructor(server) {
        super()
        this._server = server
    }

    trigger(func, message) {
        this._server.callEventer(func, message)
    }

    request(func, message) {
        return this._server.callWorker(func, message)
    }
}

module.exports = LocalClient