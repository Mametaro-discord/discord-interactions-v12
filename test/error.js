const { register, TypeError } = require('./DiscordjsError');

register('INVALID_TYPE', Error)
console.log(String(100, 200))

throw new TypeError('INVALID_TYPE', 'id', 'Snowflake')