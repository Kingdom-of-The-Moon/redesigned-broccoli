const Validator = require('jsonschema').Validator;
const v = new Validator();

module.exports = (data, schema) => {
	return v.validate(data, schema, { required: true });
}