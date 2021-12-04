'use strict';

const Base = require('./Base');
const ExtendedAPIMessage = require('./extended/ExtendedAPIMessage');
const {
	InteractionReplyTypes
} = require('../interfaces/Types');

class InteractionReply extends Base {
	/**
	 * @param {Interaction}
	 * @param {ExtendedWebhookClient}
	 */
	constructor(interaction, webhook) {
		super(interaction.client);
		/**
		 * @type {Interaction}
		 */
		this.interaction = interaction;
		/**
		 * @type {ExtendedWebhookClient}
		 */
		this.webhook = webhook;
		/**
		 * @type {boolean}
		 */
		this.deferred = false;
		/**
		 * @type {boolean}
		 */
		this.ephemeral = false;
		/**
		 * @type {boolean}
		 */
		this.replied = false;
	};
	/**
	 * @Equals @InteractionReply#ephemeral
	 * @type {boolean}
	 * @readonly
	 */
	get isEphemeral() {
		return this.ephemeral;
	};
	/**
	 * @param {StringResolvable}
	 * @optional {MessageOptions}
	 * @return {Promise<this>}
	 */
	async send(content, options = {}) {
		if (this.replied) throw new Error('This interaction is already replied.');

		if (options === null) options = {
			components: []
		};

		if (typeof options === 'boolean' && options === true) {
			options = {
				flags: 1 << 6
			};
		};

		const { data, files } = await (
				content instanceof ExtendedAPIMessage
					? content
					: ExtendedAPIMessage.create(content)
			).resolveData().resolveFiles();

		if (typeof data.ephemeral === 'boolean' && data.ephemeral === true) data.flags = 1 << 6;
		if (data.flags === 1 << 6) this.ephemeral = true;

		await this.client.api.interactions(this.interaction.id, this.interaction.token).callback.post({
			data: {
				type: InteractionReplyTypes.CHANNEL_MESSAGE_WITH_SOURCE,
				data: data
			},
			files: files,
			auth: false
		});
		this.replied = true;

		return this;
	};
	/**
	 * @param {StringResolvable}
	 * @optional {MessageOptions}
	 * @return {Promise<APIMessage | Message>}
	 */
	async edit(content, options = {}) {
		if (!this.replied) throw new Error('This interaction has no reply.');

		if (options === null) options = {
			components: []
		};

		return await this.webhook.editMessage('@original', content, options);
	};
	/**
	 * @optional {boolean}
	 * @return {Promise<this>}
	 */
	async defer(ephemeral = false) {
		if (this.deferred || this.replied) throw new Error('This interaction is replied or deferred.');

		if (typeof ephemeral === 'boolean' && ephemeral === true) this.ephemeral = true;

		await this.client.api.interactions(this.interaction.id, this.interaction.token).callback.post({
			data: {
				type: InteractionReplyTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
				data: {
					flags: ephemeral ? 1 << 6 : undefined
				}
			},
			auth: false
		});
		this.deferred = true;

		return this;
	};
	/**
	 * @optional {boolean}
	 * @return {Promise<this>}
	 */
	async deferUpdate(ephemeral = false) {
		if (this.deferred || this.replied) throw new Error('This interaction is replied or deferred.');

		if (typeof ephemeral === 'boolean' && ephemeral === true) this.ephemeral = true;

		await this.client.api.interactions(this.interaction.id, this.interaction.token).callback.post({
			data: {
				type: InteractionReplyTypes.DEFERRED_UPDATE_MESSAGE,
				data: {
					flags: ephemeral ? 1 << 6 : undefined
				}
			},
			auth: false
		});
		this.deferred = true;

		return this;
	};
	/**
	 * @return {Promise<APIMessage | Message>}
	 */
	fetch() {
		if (this.ephemeral) throw new Error('The reply is ephemeral.');

		return this.webhook.fetchMessage('@original');
	};
	/**
	 * @return {Promise<undefined>}
	 */
	delete() {
		if (!this.replied) throw new Error('This interaction has no reply.');

		if (this.ephemeral) throw new Error('The reply is ephemeral.');

		return this.webhook.fetchMessage('@original');
	};
};

module.exports = InteractionReply;