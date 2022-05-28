
const EventEmitter = require('events');
const nanoid       = require('nanoid').customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 16);

const { PAYLOAD_TYPE,
        buildPayload,
        getPayload  } = require('./data');

class ExtWSClient {
	constructor () {
		this._emitter = new EventEmitter();

		this.id = nanoid();
	}

	on (...args) {
		if (this._emitter instanceof EventEmitter) {
			return this._emitter.on(...args);
		}

		throw new Error('Cannot add a listener to disconnected client.');
	}

	once (...args) {
		if (this._emitter instanceof EventEmitter) {
			return this._emitter.once(...args);
		}

		throw new Error('Cannot add a listener to disconnected client.');
	}

	emit () {
		throw new Error('Method "emit(payload)" must be defined by ExtWSClient extension.');
	}

	join () {
		throw new Error('Method "join(group_id)" must be defined by ExtWSClient extension.');
	}

	leave () {
		throw new Error('Method "leave(group_id)" must be defined by ExtWSClient extension.');
	}

	send (arg0, arg1) {
		this.emit(
			getPayload(
				arg0,
				arg1,
			),
		);
	}

	disconnect () {
		if (this._emitter instanceof EventEmitter) {
			const emitter = this._emitter;

			this._emitter = null;

			emitter.emit('disconnect');
			emitter.removeAllListeners();
		}

		this._driver.clients.delete(
			this.id,
		);
	}

	ping () {
		this.emit(
			buildPayload(PAYLOAD_TYPE.PING),
		);
	}
}

module.exports = ExtWSClient;
