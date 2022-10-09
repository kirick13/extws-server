
const EventEmitter = require('events');

const { IDLE_TIMEOUT,
        TIMEFRAME_PING_DISCONNECT,
        PAYLOAD_TYPE,
        buildPayload,
        parsePayload } = require('./data');

const IDLE_TIMEOUT_DISCONNECT_MS   = IDLE_TIMEOUT * 1e3;
const TIMEFRAME_PING_DISCONNECT_MS = TIMEFRAME_PING_DISCONNECT * 1e3;
const IDLE_TIMEOUT_PING_MS         = IDLE_TIMEOUT_DISCONNECT_MS - TIMEFRAME_PING_DISCONNECT_MS;

class ExtWSDriver {
	constructor () {
		this._emitter = new EventEmitter();

		this.clients = new Map();

		this._deferClientsWatch();
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

	_deferClientsWatch () {
		setTimeout(
			() => {
				this._pingSilentClients();
			},
			IDLE_TIMEOUT_PING_MS,
		);
	}

	_pingSilentClients () {
		const ts_now_ms = Date.now();

		for (const client of this.clients.values()) {
			const idle_ms = ts_now_ms - client._ts_last_active;

			if (idle_ms >= IDLE_TIMEOUT_PING_MS) {
				client.ping();
			}
		}

		setTimeout(
			() => {
				this._disconnectDeadClients();
			},
			TIMEFRAME_PING_DISCONNECT_MS,
		);
	}

	_disconnectDeadClients () {
		const ts_now_ms = Date.now();

		for (const client of this.clients.values()) {
			const idle_ms = ts_now_ms - client._ts_last_active;

			if (idle_ms >= IDLE_TIMEOUT_DISCONNECT_MS) {
				client.disconnect(
					null, // is_already_disconnected
					true, // hard
				);

				this.clients.delete(
					client.id,
				);
			}
		}

		this._deferClientsWatch();
	}
}

module.exports = ExtWSDriver;
