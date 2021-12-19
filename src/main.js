
const { GROUP_BROADCAST,
        GROUP_PREFIX,
        buildMessagePayload } = require('./data');
const ExtWSClient             = require('./client');

const getPayload = (arg0, arg1) => {
	let event_type = arg0;
	let data = arg1;
	if (
		undefined === arg1
		&& typeof arg0 !== 'string'
	) {
		data = arg0;
		event_type = undefined;
	}

	return buildMessagePayload(
		data,
		event_type,
	);
};

class ExtWS {
	constructor (
		ExtWSDriver,
		{
			port,
			path = '/ws',
		} = {},
	) {
		if (typeof port !== 'number') {
			throw new TypeError('Argument "port" must be a number.');
		}

		this._driver = new ExtWSDriver({
			port,
			path,
			payload_max_length: 2 ** 20, // 1 MiB
		});
		this.clients = this._driver.clients;
	}

	on (...args) {
		return this._driver._emitter.on(...args);
	}

	once (...args) {
		return this._driver._emitter.once(...args);
	}

	_sendPayload ( // eslint-disable-line max-params
		payload,
		socket_id = null,
		group_id = null,
		is_broadcast = false,
		is_from_adapter = false,
	) {
		if (typeof socket_id === 'string') {
			const client = this.clients.get(socket_id);
			if (client instanceof ExtWSClient) {
				client.emit(payload);
			}
		}
		else if (typeof group_id === 'string') {
			this._driver.publish(
				GROUP_PREFIX + group_id,
				payload,
			);
		}
		else if (is_broadcast) {
			this._driver.publish(
				GROUP_BROADCAST,
				payload,
			);
		}

		if (
			!is_from_adapter
			&& this._adapter
		) {
			this._adapter.publish(
				payload,
				socket_id,
				group_id,
				is_broadcast,
			);
		}
	}

	toSocket (socket_id, arg0, arg1) {
		this._sendPayload(
			getPayload(
				arg0,
				arg1,
			),
			socket_id,
		);
	}

	toGroup (group_id, arg0, arg1) {
		this._sendPayload(
			getPayload(
				arg0,
				arg1,
			),
			null, // socket_id
			group_id,
		);
	}

	broadcast (arg0, arg1) {
		this._sendPayload(
			getPayload(
				arg0,
				arg1,
			),
			null, // socket_id
			null, // group_id
			true, // broadcast
		);
	}
}

module.exports = ExtWS;
