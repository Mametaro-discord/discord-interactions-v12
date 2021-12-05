'use strict';

const ApplicationCommand = require('./ApplicationCommand');
const BaseInteraction = require('./BaseInteraction');
const InteractionReply = require('InteractionReply');
const ExtendedWebhookClient = require('./extended/ExtendedWebhookClient');

class CommandInteraction extends BaseInteraction {
	/**
	 * @param {Client}
	 * @param {APICommandInteraction | CommandInteractionData}
	 */
	constructor(client, data = {}) {
		super(client, data);
		/**
		 * @type {Snowflake}
		 */
		this.commandId = data.data.id;
		/**
		 * @type {string}
		 */
		this.commandName = data.data.name;
		/**
		 * @type {ExtendedWebhookClient}
		 */
		this.webhook = new ExtendedWebhookClient(this.applicationId, this.token, this.client.options);
		/**
		 * @type {InteractionReply}
		 */
		this.reply = new InteractionReply(this, this.webhook);
		/**
		 * @type {ApplicationCommandOption[]}
		 */
		this.options = ApplicationCommand.transformOptions(data.data.options);
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
	get isEphemeral() {
		return this.reply.ephemeral;
	}
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
	 * @type {?ApplicationCommand}
	 * @readonly
	 */
	get command() {
		return (this.guild || this.client).commands.cache.get(this.commandId) || null;
	};
};

module.exports = CommandInteraction;