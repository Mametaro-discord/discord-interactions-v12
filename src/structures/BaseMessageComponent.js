'use strict';

const { MessageComponentTypes } = require('../interfaces/Types');

class BaseMessageComponent {
	/**
	 * @param {APIMessageComponent | MessageComponentData}
	 */
	constructor(data = {}) {
		/**
		 * @type {string}
		 */
		this.type = (typeof data.type === 'string' ? data.type : MessageComponentTypes[data.type]) || null;
	};
	/**
	 * @param {APIMessageComponent | MessageComponentData}
	 * @optional {Client}
	 * @return {?MessageComponent}
	 */
	static create(data = {}, client) {
		const type = MessageComponentTypes[data.type];

		let MessageComponent;
		switch(type) {
			case MessageComponentTypes.ACTION_ROW:
			MessageComponent = require('./MessageActionRow');
			break;

			case MessageComponentTypes.BUTTON:
			MessageComponent = require('./MessageButton');
			break;

			case MessageComponentTypes.SELECT_MENU:
			MessageComponent = require('./MessageSelectMenu');
			break;
		};

		return new MessageComponent(data, client);
	};
};

module.exports = BaseMessageComponent;