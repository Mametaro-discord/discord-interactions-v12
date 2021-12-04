'use strict';

const ApplicationCommand = require('../structures/ApplicationCommand');
const ApplicationCommandPermissionsManager = require('./ApplicationCommandPermissionsManager');
const { BaseManager, Collection } = require('discord.js');

class ApplicationCommandManager extends BaseManager {
	/**
	 * @param {Client}
	 */
	constructor(client) {
		super(client, undefined, ApplicationCommand);
		/**
		 * @type {ApplicationCommandPermissionsManager}
		 */
		this.permissions = new ApplicationCommandPermissionsManager(this);
	};
	/**
	 * @param {ApplicationCommandData}
	 * @optional {boolean}
	 * @optional {Snowflake}
	 * @return {ApplicationCommand}
	 */
	add(data, cache, guildId) {
		const guild = (this.guild && this.guild.id) || this.guildId || guildId;
		return super.add(data, cache, {
			extras: [this.guild, guild]
		});
	};
	/**
	 * @optional {PathApplicationCommandOptions}
	 * @return {Object}
	 */
	commandPath({ commandId, guildId } = {}) {
		const guild = (this.guild && this.guild.id) || this.guildId || guildId;
		const path = this.client.api.applications(this.client.user.id).guilds(guild);
		return commandId ? path.commands(commandId) : path.commands;
	};
	/**
	 * @param {APIApplicationCommand | ApplicationCommandData}
	 * @optional {Snowflake}
	 * @return {Promise<ApplicationCommand>}
	 */
	async create(data, guildId) {
		const result = await this.commandPath({ guildId }).post({
			data: data
		});
		return this.add(result, true, guildId);
	};
	/**
	 * @param {APIApplicationCommand[] | ApplicationCommandData[]}
	 * @optional {Snowflake}
	 * @return {Promise<Collection<Snowflake, ApplicationCommand>>}
	 */
	async set(commands = [], guildId) {
		const data = await this.commandPath({ guildId }).put({
			data: commands
		});
		return data.reduce(
				(col, elm) => col.set(elm.id, this.add(elm, true, guildId)),
				new Collection()
			);
	};
	/**
	 * @You can put "ApplicationCommandFetchOptions" and Snowflake(id of command) to the first argument.
	 * 
	 * @optional {Snowflake}
	 * @optional {FetchApplicationCommandOptions}
	 * @return {Promise<ApplicationCommand | Collection<Snowflake, ApplicationCommand>>}
	 */
	async fetch(commandId, { guildId, cache = true, force = false } = {}) {
		if (typeof commandId === 'object') {
			const { commandId, guildId, cache = true, force = false } = commandId;
		} else if (commandId) {
			if (!force) {
				const existing = this.cache.get(commandId);
				if (existing) return existing;
			};
			const command = await this.commandPath({ commandId, guildId }).get();
			return this.add(command, cache, guildId);
		};

		const data = await this.commandPath({ commandId, guildId }).get();
		if (Array.isArray(data)) {
			data = dara.reduce(
					(col, elm) => col.set(elm.id, this.add(elm, cache, guildId)),
					new Collection()
				);
		} else {
			data = this.add(data, cache, guildId);
		};
		return data
	};
	/**
	 * @param {Snowflake}
	 * @param {APIApplicationCommand[] | ApplicationCommand[]}
	 * @optional {Snowflake}
	 * @return {Promise<ApplicationCommand>}
	 */
	async edit(commandId, data, guildId) {
		const patched = await this.commandPath({ commandId, guildId }).patch({
			data: data
		});
		return this.add(patched, true, guildId);
	};
	/**
	 * @param {Snowflake}
	 * @optional {Snowflake}
	 * @return {Promise<ApplicationCommand>}
	 */
	async delete(commandId, guildId) {
		await this.commandPath({ commandId, guildId }).delete();

		const data = this.cache.get(commandId);
		this.cache.delete(commandId);
		return data;
	};
};

module.exports = ApplicationCommandManager;