module.exports = parse = str => JSON.parse(str, (k, v) => {
	if (
		v !== null &&
		typeof v === 'object' &&
		'type' in v &&
		v.type === 'Buffer' &&
		'data' in v &&
		Array.isArray(v.data)) {
		return Buffer.from(v.data);
	}
	return v;
});