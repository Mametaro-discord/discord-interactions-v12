'use strict';

const {
	ChannelTypes
} = require('../interfaces/Types');

class Util {
	/**
	 * @param {APIChannelType | APIChannelType[]}
	 * @param {boolean} whether the result is for API
	 * @return {ChannelType}
	 */
	static resolveChannelTypes(types, toAPI) {
		let target = Array.isArray(types) ? types : [types];

		target.map(elm => toAPI
				? (typeof elm === 'number' ? elm : ChannelTypes[elm])
				: (typeof elm === 'string' ? elm : ChannelType[elm])
			);

		return Array.isArray(types) ? target : target.shift();
	};
};

module.exports = Util;