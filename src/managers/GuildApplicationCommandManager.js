'use strict';

const ApplicationCommandManager = require('./ApplicationCommandManager');
const ApplicationCommandPermissionsManager = require('./ApplicationCommandPermissionsManager');

class GuildApplicationCommandManager extends ApplicationCommandManager {
	/**
	 * @param {Guild}
	 */
	constructor(guild) {
		super(guild.client);
		/**
		 * @type {Guild}
		 */
		this.guild = guild;
		/**
		 * @type {Snowflake}
		 */
		this.guildId = guild && guild.id;
		/**
		 * @type {ApplicationCommandPermissionsManager}
		 */
		this.permissions = new ApplicationCommandPermissionsManager(this);
	};
};

module.exports = GuildApplicationCommandManager;