'use strict';

const ExtendedAPIMessage = require('./ExtendedAPIMessage');
const { Structures } = require('discord.js');
const DMChannel = Structures.get('DMChannel');
const GuildMember = Structures.get('GuildMember');
const User = Structures.get('User');

class ExtendedDMChannel extends DMChannel {
	/**
	 * @param {any}
	 * @optional {MessageOptions}
	 * @return {APIMessage | Message}
	 */
	async send(content, options) {
		if ((this instanceof GuildMember) || (this instanceof User)) {
			const dm = await this.createDM();
			return dm.send(content, options);
		};

		const { data, files } = await (
				content instanceof ExtendedAPIMessage
				? content
				: ExtendedAPIMessage.create(this, content, options)
			).resolveData().resolveFiles();

		return this.client.api.channels(this.id).messages.post({
			data: data,
			files: files
		});
	};
	/**
	 * @param {Function}
	 * @optional {InteractionCollectorOptions}
	 * @return {InteractionCollector}
	 */
	createMessageComponentCollector(filter, options) {
		options.interactionType = InteractionTypes.MESSAGE_COMPONENT;
		options.channel = this;

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
};

module.exports = ExtendedDMChannel;