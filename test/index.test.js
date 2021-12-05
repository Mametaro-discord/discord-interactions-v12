const { message } = require('./error');

console.log(message);

Object.assign(message, {
	message: 'STRING'
});

console.log(require('./error').message);