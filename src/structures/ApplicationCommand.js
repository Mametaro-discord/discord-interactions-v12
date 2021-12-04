'use strict';

const { resolveChannelTypes } = require('../util/Util');
const Base = require('./Base');
const ApplicationCommandPermissionsManager = require('./ApplicationCommandPermissionsManager');
const {
	ApplicationCommandTypes,
	ChannelTypes
} = require('../interfaces/Types');
const {
	SnowflakeUtil
} = require('discord.js');

class ApplicationCommand extends Base {
	/**
	 * @param {Client}
	 * @param {APIApplicationCommand | ApplicationCommandData}
	 * @optional {Guild}
	 * @optional {Snowflake}
	 */
	constructor(client, data = {}, guild, guildId) {
		super(client);
		/**
		 * @type {Snowflake}
		 */
		this.id = data.id;
		/**
		 * @type {Snowflake}
		 */
		this.applicationId = data.application_id || data.applicationId;
		/**
		 * @type {?Guild}
		 */
		this.guild = guild || null;
		/**
		 * @type {?Snowflake}
		 */
		this.guildId = guild.id || guildId || null;
		/**
		 * @type {ApplicationCommandPermissionsManager}
		 */
		this.permissions = new ApplicationCommandPermissionsManager(this);
		/**
		 * @type {ApplicationCommandType}
		 */
		this.type = typeof data.type === 'string' ? data.type : ApplicationCommandTypes[data.type];

		this.patch(data);
	};
	/**
	 * @param {APIApplicationCommand | ApplicationCommandData}
	 * @return {undefined}
	 */
	patch(data = {}) {
		if ('name' in data) {
			/**
			 * @type {string}
			 */
			this.name = data.name;
		};

		if ('description' in data) {
			/**
			 * @type {string}
			 */
			this.description = data.description;
		};

		if ('options' in data) {
			/**
			 * @type {ApplicationCommandOptions[]}
			 */
			this.options;
		} else if (!this.options) {
			this.options = [];
		};

		if ('default_permission' in data) {
			/**
			 * @type {boolean}
			 */
			this.defaultPermission = data.default_permission;
		};

		if ('version' in data) {
			/**
			 * @type {Snowflake}
			 */
			this.version = data.version;
		};
	};
	/**
	 * @type {number}
	 * @readonly
	 */
	get createdTimestamp() {
		return SnowflakeUtil.deconstruct(this.id).timestamp;
	};
	/**
	 * @type {Date}
	 * @readonly
	 */
	get createdAt() {
		return new Date(this.createdTimestamp);
	};
	/**
	 * @type {ApplicationCommandManager | GuildApplicationCommandManager}
	 * @readonly
	 */
	get manager() {
		return (this.guild || this.client).commands;
	};
	/**
	 * @param {ApplicationCommandData}
	 * @return {Promise<ApplicationCommand>}
	 */
	async edit(data) {
		return await this.manager.edit(this.id, data, this.guildId);
	};
	/**
	 * @return {Promise<ApplicationCommand>}
	 */
	async delete() {
		return await this.manager.delete(this.id, this.guildId);
	};
	/**
	 * @param {(APIApplicationCommandOption | ApplicationCommandOptionData) | Array<()>}
	 * @optional {boolean} whether the options is for API
	 * @return {ApplicationCommandOption | ApplicationCommandOption[]}
	 */
	static transformOptions(options, toAPI) {
		let target = Array.isArray(options) ? options : [options];

		const channelTypesKey = toAPI ? 'channel_types' : 'channelTypes';
		const minValueKey = toAPI ? 'min_value' : 'minValue';
		const maxValueKey = toAPI ? 'max_value' : 'maxValue';

		target.map(elm => {
			return {
				type: ApplicationCommandOptionTypes[elm.type],
				name: elm.name,
				description: elm.description,
				required: elm.required,
				choices: choices,
				options: this.transformOptions(elm.options),
				[channelTypesKey]: resolveChannelTypes(elm.channelTypes || elm.channel_types),
				[minValueKey]: elm.minValue || elm.min_value,
				[maxValueKey]: elm.maxValue || elm.max_value,
				autocomplete: elm.autocomplete
			};
		});

		return Array.isArray(options) ? options : options.shift();
	};
};

module.exports = ApplicationCommand;