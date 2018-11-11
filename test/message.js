const assert = require('assert')
const { model } = require('../')

describe('model.Message', () => {
    describe('.newEmptyJsonBody', () => {
        let message = model.Message.newEmptyJsonBody()

        it('creates a new empty message', () => {
            assert(message !== null, 'message was null')
            assert.deepStrictEqual(message.body, {}, 'message.body was not an empty object')
        })

        it('its methods works', () => {
            message.addMeta('test', 'value')
            assert(message.metadata['test'] === 'value', 'addMeta does not work')

            message.setBody('value')
            assert(message.body === 'value', 'setBody does not work')
        })
    })

    describe('.newEmptyStringBody', () => {
        let message = model.Message.newEmptyStringBody()

        it('creates a new empty message', () => {
            assert(message !== null, 'message was null')
            assert(message.body === '', 'message.body was not an empty string')
        })

        it('its methods works', () => {
            message.addMeta('test', 'value')
            assert(message.metadata['test'] === 'value', 'addMeta does not work')

            message.setBody('value')
            assert(message.body === 'value', 'setBody does not work')
        })
    })

    describe('.newSuccess', () => {
        let message = model.Message.newSuccess('success')

        it('creates a new empty message', () => {
            assert(message !== null, 'message was null')
            assert(message.body === 'success', 'Message.body was not "success"')
            assert(message.metadata['result'] === 'success', 'result header was not "success"')
        })

        it('its methods works', () => {
            message.addMeta('test', 'value')
            assert(message.metadata['test'] === 'value', 'addMeta does not work')

            message.setBody('value')
            assert(message.body === 'value', 'setBody does not work')
        })
    })

    describe('.newError', () => {
        let message = model.Message.newError('bad')

        it('creates a new empty message', () => {
            assert(message !== null, 'message was null')
            assert(message.body.message === 'bad', 'Message.body.message was not "bad"')
            assert(message.metadata['result'] === 'error', 'result header was not "error"')
        })

        it('its methods works', () => {
            message.addMeta('test', 'value')
            assert(message.metadata['test'] === 'value', 'addMeta does not work')

            message.setBody('value')
            assert(message.body === 'value', 'setBody does not work')
        })
    })
})