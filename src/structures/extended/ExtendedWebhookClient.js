'use strict';

const { MessageEmbed, WebhookClient } = require('discord.js');
const ExtendedAPIMessage = require('./ExtendedAPIMessage');

class ExtendedWebhookClient extends WebhookClient {
	/**
	 * @param {any}
	 * @optional {Object}
	 * @return {Object}
	 */
	async sendMessage(content, options) {
		if ((content && content.embed) instanceof MessageEmbed) {
			if (options) {
				if (Array.isArray(options.embeds)) {
					options.embeds.push(content.embed);
				} else {
					options.embeds = [content.embed];
				};
			} else {
				options = {
					embeds: [content.embed]
				};
			};
			content.embed = null;
		};

		if (options && options.embed) {
			if (options) {
				if (Array.isArray(options.embeds)) {
					options.embeds.push(options.embed);
				} else {
					options.embeds = [options.embed];
				};
			} else {
				options = {
					embeds: [options.embed]
				};
			};
			options.embed = null;
		};

		if ((content && content.ephemeral) || (options && options.ephemeral)) {
			options.flags = 1 << 6;
		};

		const { data, files } = await (
				content instanceof ExtendedAPIMessage
				? content
				: ExtendedAPIMessage.create(this, content, options)
			).resolveData().resolveFiles();

		return this.client.api.webhooks(this.id, this.token).messages.post({
			data: data,
			files: files,
			auth: false
		});
	};
	/**
	 * @param {string}
	 * @param {any}
	 * @optional {Object}
	 * @return {Object}
	 */
	async editMessage(id, content, options) {
		if ((content && content.embed) instanceof MessageEmbed) {
			if (options) {
				if (Array.isArray(options.embeds)) {
					options.embeds.push(content.embed);
				} else {
					options.embeds = [content.embed];
				};
			} else {
				options = {
					embeds: [content.embed]
				};
			};
			content.embed = null;
		};

		if (options && options.embed) {
			if (options) {
				if (Array.isArray(options.embeds)) {
					options.embeds.push(options.embed);
				} else {
					options.embeds = [options.embed];
				};
			} else {
				options = {
					embeds: [options.embed]
				};
			};
			options.embed = null;
		};

		if ((content && content.ephemeral) || (options && options.ephemeral)) {
			options.flags = 1 << 6;
		};

		const { data, files } = await (
				content instanceof ExtendedAPIMessage
				? content
				: ExtendedAPIMessage.create(content)
			).resolveData().resolveFiles();

		return this.api.webhooks(this.id, this.token).messages(id).patch({
			data: data,
			files: files,
			auth: false
		});
	};
	/**
	 * @param {string}
	 * @return {undefined}
	 */
	async deleteMessage(id) {
		await this.client.api.webhooks(this.id, this.token).messages(id).delete({
			auth: false
		});
	};
	/**
	 * @param {string}
	 * @return {Object}
	 */
	async fetchMessage(id) {
		return this.client.api.webhooks(this.id, this.token).messages(id).get({
			auth: false
		});
	};
};

module.exports = ExtendedWebhookClient;