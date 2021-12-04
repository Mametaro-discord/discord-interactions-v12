'use strict';

const Base = require('../structures/Base');
const { Collection } = require('discord.js');

class ApplicationCommandPermissionsManager extends Base {
	/**
	 * @param {ApplicationCommand | ApplicationCommandManager | GuildApplicationCommandManager}
	 */
	constructor(manager) {
		super(manager.client);
		/**
		 * @type {ApplicationCommand | ApplicationCommandManager | GuildApplicationCommandManager}
		 */
		this.manager = manager;
		/**
		 * @type {?Guild}
		 */
		this.guild = manager.guild || null;
		/**
		 * @type {?Snowflake}
		 */
		this.guildId = (manager.guild && manager.guild.id) || manager.guildId || null;
		/**
		 * @type {?Snowflake}
		 */
		this.commandId = manager.id || null;
	};
	/**
	 * @type {ApplicationCommand}
	 * @readonly
	 */
	get command() {
		return (this.guild || this.client).commands.cache.get(this.commandId);
	};
	/**
	 * @optional {Snowflake}
	 * @optional {Snowflake}
	 * @return {Object}
	 */
	permissionsPath(guildId, commandId) {
		const guild = this.guildId || guildId;
		const command = this.commandId || commandId;
		const path =  this.client.api.applications(this.client.user.id).guilds(guild);
		return (command ? path.commands(command) : path.commands).permissions;
	};
	/**
	 * @optional {FetchApplicationCommandPermissionsOptions}
	 * @return {Promise<ApplicationCommandPermissions[] | Collection<Snowflake, ApplicationCommandPermissions[]>>}
	 */
	async fetch({ guildId, commandId } = {}) {
		const data = await this.permissionsPath(guildId, commandId).get();
		if (Array.isArray(data)) {
			return data.reduce(
					(col, elm) => col.set(elm.id, elm.permissions),
					new Collection()
				);
		} else {
			return data.permissions;
		};
	};
	/**
	 * @(guildId + commandId + permissions) OR fullPermissions
	 * @param {SetApplicationCommandPermissionsOptions}
	 * @return {Promise<ApplicationCommandPermissions[] | Collection<Snowflake, ApplicationCommandPermissions[]>>}
	 */
	async set({ guildId, commandId, permissions = [], fullPermissions = []} = {}) {
		let data;
		if (fullPermissions && Array.isArray(fullPermissions)) {
			data = fullPermissions.map(elm => {
				return {
					id: elm.id,
					permissions: elm.permissions
				};
			});

			data = await this.permissionsPath(guildId).put({
				data: data
			});

			data = data.reduce(
					(col, elm) => col.set(
							elm.id,
							elm.permissions
						),
					new Collection()
				);
		} else if (Array.isArray(permissions)) {
			data = await this.permissionsPath(guildId, commandId).put({
				data: {
					permissions: permissions
				}
			});

			data = data.permissions;
		};

		return data;
	};
	/**
	 * @param {AddApplicationCommandPermissionsOptions}
	 * @return {Promise<ApplicationCommandPermissions[]>}
	 */
	async add({ guildId, commandId, permissions } = {}) {
		const existing = await this.fetch({
			guildId: guildId,
			commandId: commandId
		});

		existing.forEach(elm => {
			if (permissions.some(e => e.id === elm.id)) permissions.push(elm);
		});

		return this.set({
			guildId: guildId,
			commandId: commandId,
			permissions: permissions
		});
	};
	/**
	 * @param {RemoveApplicationCommandPermissionsOptions}
	 * @return {Promise<ApplicationCommandPermissions[]>}
	 */
	async remove({ guildId, commandId, roles, users } = {}) {
		let ids = [];
		[roles, users].forEach(elm => {
			if (Array.isArray(elm)) {
				elm.forEach(e => ids.push(e));
			} else {
				ids.push(elm);
			};
		});

		let existing;
		try {
			existing = await this.fetch({ 
				guildId: guildId,
				commandId: commandId 
			});
		} catch(e) {
			throw e;
		};

		const permissions = existing.filter(elm => !ids.includes(elm));

		return await this.set({
			guildId: guildId,
			commandId: commandId,
			permissions: permissions
		});
	};
	/**
	 * @param {HasApplicationCommandPermissionsOptions}
	 * @return {Promise<boolean>}
	 */
	async has({ guildId, commandId, id } = {}) {
		let existing;
		try {
			existing = await this.fetch({
				guildId: guildId,
				commandId: commandId
			});
		} catch(e) {
			throw e;
		};

		return existing.some(elm => elm.id === id);
	};
};

module.exports = ApplicationCommandPermissionsManager;