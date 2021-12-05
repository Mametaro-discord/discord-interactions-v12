'use strict';

const BaseMessageComponent = require('../BaseMessageComponent');
const ExtendedAPIMessage = require('./ExtendedAPIMessage');
const InteractionCollector = require('../InteractionCollector');
const {
	InteractionTypes
} = require('../../interfaces/Types');
const { Structures } = require('discord.js');
const Message = Structures.get('Message');

class ExtendedMessage extends Message {
	/**
	 * @param {APIMessage}
	 * @return {undefined}
	 */
	_patch(data = {}) {
		super._patch(data);

		if (Array.isArray(data.components)) {
			this.components = data.components.map(elm => BaseMessageComponent.create(elm));
		} else {
			this.components = [];
		};
	};
	/**
	 * @param {Function}
	 * @optional {MessageComponentCollectorOptions}
	 * @return {InteractionCollector}
	 */
	createMessageComponentCollector(filter, options) {
		options.interactionType = InteractionTypes.MESSAGE_COMPONENT;
		options.message = this;

		return new InteractionCollector(this.client, filter, options)
	};
	/**
	 * @param {Function}
	 * @optional {MessageComponentCollectorOptions}
	 * @return {Promise<MessageComponentInteraction>}
	 */
	awaitMessageComponent(filter, options = {}) {
		options.max = 1;

		return new Promise((resolve, reject) => {
			const collector = this.createMessageComponentCollector(filter, options);
			collector.on('end', (interactions, reason) => {
				const interaction = interactions.first();
				if (interaction) resolve(interaction);
				else reject(new Error(reason));
			});
		});
	};
	/**
	 * @param {StringResolvable}
	 * @optional {MessageOptions}
	 * @return {Promise<Message>}
	 */
	async edit(content, options) {
		if (options === null) options = {
			components: null
		};

		const { data, files } = await (
				content instanceof ExtendedAPIMessage
				? content
				: ExtendedAPIMessage.create(content)
			).resolveData().resolveFiles();

		return this.client.api.channels(this.channel.id).messages(this.id).patch({
			data: data,
			files: files
		}).then(d => {
			const clone = this._clone();
			clone.patch(d);
			return clone;
		});
	};
};

module.exports = ExtendedMessage;