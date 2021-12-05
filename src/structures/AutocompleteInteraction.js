'use strict';

const BaseInteraction = require('./BaseInteraction');
const {
	ApplicationCommandOptionTypes,
	InteractionReplyTypes
} = require('../interfaces/Types');

class AutocompleteInteraction extends BaseInteraction {
	/**
	 * @param {Client}
	 * @param {APIAutocompleteInteraction | AutocompleteInteractionData}
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
		 * @type {boolean}
		 */
		this.responded = false;
		/**
		 * @type {AutocompleteOption[]}
		 */
		this.options = this.constructor.transformOptions(data.data.options);
	};
	/**
	 * @type {ApplicationCommand}
	 */
	get command() {
		return (
				(this.guild && this.guild.commands.cache.get(this.commandId)) ||
				this.client.commands.cache.get(this.commandId)
			) || null;
	};
	/**
	 * @param {ApplicationCommandOptionChoice[]}
	 * @return {Promise<undefined>}
	 */
	async respond(choices) {
		if (this.responded) throw new Error('This interaction is already responded.');

		await this.client.api.interactions(this.id, this.token).callback.post({
			data: {
				type: InteractionReplyTypes.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
				data: {
					choices: choices
				}
			},
			auth: false
		});
		this.responded = true;
	}
	/**
	 * @param {APIAutocompleteOption | APIAutocompleteOption[]}
	 * @return {AutocompleteOption | AutocompleteOption[]}
	 */
	static transformOptions(options) {
		let target = Array.isArray(options)
			? options
			: [options];

		target = target.map(elm => {
			let result = {
				name: elm.name,
				type: ApplicationCommandOptionTypes[elm.type]
			};

			if ('value' in elm) result.value = elm.value;
			if ('focused' in elm) result.focused = elm.focused;
			if (Array.isArray(elm.options)) result.options = this.transformOptions(elm.options);
		});

		return Array.isArray(options)
			? options
			: options.shift();
	};
};

module.exports = AutocompleteInteraction;