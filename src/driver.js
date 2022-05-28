
const EventEmitter = require('events');

const { IDLE_TIMEOUT,
        PAYLOAD_TYPE,
        buildPayload,
        parsePayload } = require('./data');

const IDLE_TIMEOUT_PING_MS = (IDLE_TIMEOUT * 0.94) * 1e3;
const IDLE_TIMEOUT_DISCONNECT_MS = (IDLE_TIMEOUT + 5) * 1e3;

class ExtWSDriver {
	constructor () {
		this._emitter = new EventEmitter();

		this.clients = new Map();

		setInterval(
			() => {
				this._clearBrokenClients();
			},
			IDLE_TIMEOUT * 1e3,
		);
	}

	_onConnect (client) {
		// console.log(new Date(), 'client connected', client);

		this.clients.set(
			client.id,
			client,
		);

		client._ts_last_active = Date.now();

		client.emit(
			buildPayload(
				PAYLOAD_TYPE.INIT,
				{
					id: client.id,
					idle_timeout: IDLE_TIMEOUT,
				},
			),
		);

		this._emitter.emit(
			'connect',
			client,
		);
	}

	_onMessage (client, payload) {
		// console.log(new Date(), 'got message', client);

		client._ts_last_active = Date.now();

		const {
			type,
			data,
			event_type,
		} = parsePayload(payload);

		switch (type) {
			case PAYLOAD_TYPE.PING: {
				client.emit(
					buildPayload(PAYLOAD_TYPE.PONG),
				);
			} break;
			case PAYLOAD_TYPE.MESSAGE: {
				client._emitter.emit(
					event_type ?? 'message',
					data,
				);
			} break;
			// no default
		}
	}

	_clearBrokenClients () {
		const ts_now = Date.now();

		for (const client of this.clients.values()) {
			const idle_ms = ts_now - client._ts_last_active;

			if (idle_ms >= IDLE_TIMEOUT_DISCONNECT_MS) {
				client.disconnect(
					null, // is_already_disconnected
					true, // hard
				);

				this.clients.delete(
					client.id,
				);
			}
			else if (idle_ms >= IDLE_TIMEOUT_PING_MS) {
				client.ping();
			}
		}
	}
}

module.exports = ExtWSDriver;
