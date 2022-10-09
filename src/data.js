
exports.IDLE_TIMEOUT = 60;
exports.TIMEFRAME_PING_DISCONNECT = 5;

exports.GROUP_BROADCAST = 'broadcast';
exports.GROUP_PREFIX = 'g-';

const PAYLOAD_TYPE = exports.PAYLOAD_TYPE = {
	INIT: 1,
	PING: 2,
	PONG: 3,
	MESSAGE: 4,
};

const buildPayload = exports.buildPayload = (payload_type, data, event_type) => {
	let payload = String(payload_type);

	if (event_type) {
		payload += event_type;
	}

	if (data) {
		payload += JSON.stringify(data);
	}

	return payload;
};
const buildMessagePayload = exports.buildMessagePayload = (data, event_type) => buildPayload(
	PAYLOAD_TYPE.MESSAGE,
	data,
	event_type,
);

exports.getPayload = (arg0, arg1) => {
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

const JSON_START = new Set([ '[', '{' ]);
exports.parsePayload = (payload) => {
	const result = {
		type: payload.charCodeAt(0) - 48,
	};

	let start = 1;
	let event_type = '';
	for (let i = start; i < payload.length && JSON_START.has(payload[i]) === false; i++) {
		event_type += payload[i];
		start++;
	}

	if (event_type.length > 0) {
		result.event_type = event_type;
	}

	if (start < payload.length) {
		result.data = JSON.parse(
			payload.slice(start),
		);
	}

	return result;
};
