'use strict';

const Guild = require('discord.js').Structures.get('Guild');
const GuildApplicationCommandManager = require('../../managers/GuildApplicationCommandManager');

class ExtendedGuild extends Guild {
	/**
	 * @param {Client}
	 * @param {APIGuild}
	 */
	constructor(client, data = {}) {
		super(client, data);
		/**
		 * @type {GuildApplicationCommandManager}
		 */
		this.commands = new GuildApplicationCommandManager(this);
	};
};

module.exports = ExtendedGuild;