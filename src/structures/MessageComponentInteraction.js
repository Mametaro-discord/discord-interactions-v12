'use strict';

const BaseInteraction = require('./BaseInteraction');
const BaseMessageComponent = require('./BaseMessageComponent');
const InteractionReply = require('./InteractionReply');
const ExtendedWebhookClient = require('./ExtendedWebhookClient');
const {
	MessageComponentTypes
} = require('../interfaces/Types');

class MessageComponentInteraction extends BaseInteraction {
	/**
	 * @param {Client}
	 * @param {APIMessageComponentInteraction | MessageComponentInteractionData}
	 */
	constructor(client, data = {}) {
		super(client, data);
		/**
		 * @type {APIMessage | Message}
		 */
		this.message = (this.channel && this.channel.messages.add(data.message)) || data.message;
		/**
		 * @type {string}
		 */
		this.customId = data.data.customId || data.data.custom_id;
		/**
		 * @type {MessageComponentType}
		 */
		this.componentType = this.constructor.resolveType(data.data.type);
		/**
		 * @type {ExtendedWebhookClient}
		 */
		this.webhook = new ExtendedWebhookClient(this.applicationId, this.token, this.client.options);
		/**
		 * @type {InteractionReply}
		 */
		this.reply = new InteractionReply(this, this.webhook);
	};
	/**
	 * @type {APIMessageActionRowComponent | MessageActionRowComponent}
	 * @readonly
	 */
	get component() {
		return this.constructor.resolveComponents(this.message.components).find(elm => (elm.customId || elm.custom_id) === this.customId);
	};
	/**
	 * @type {boolean}
	 * @readonly
	 */
	get ephemeral() {
		return this.reply.ephemeral;
	};
	/**
	 * @type {boolean}
	 * @readonly
	 */
	get deferred() {
		return this.reply.deferred;
	};
	/**
	 * @type {boolean}
	 * @readonly
	 */
	get replied() {
		return this.reply.replied;
	};
	/**
	 * @transform data from api
	 * @param {APIMessageComponent[]}
	 * @param {boolean} whether the result is array
	 * @return {MessageComponent[]}
	 */
	static resolveComponents(arr) {
		let result = [];

		arr.forEach(elm => {
			if (elm.type === MessageComponentTypes.ACTION_ROW) {
				elm.components.forEach(e => result.push(BaseMessageComponent.create(e)));
			} else {
				BaseMessageComponent.create(elm);
			};
		});

		return result;
	};
	/**
	 * @param {MessageComponentTypeResolvable}
	 * @optional {boolean} whether the result is for API
	 * @return {MessageComponentType}
	 */
	static resolveType(type, toAPI) {
		return toAPI
			? (typeof type === 'number' ? type : MessageComponentTypes[type])
			: (typeof type === 'string' ? type : MessageComponentTypes[type]);
	};
};

module.exports = MessageComponentInteraction;