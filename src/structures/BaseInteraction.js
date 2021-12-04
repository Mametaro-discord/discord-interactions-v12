'use strict';

const Base = require('./Base');
const InteractionAuthor = require('./InteractionAuthor');
const {
	InteractionTypes,
	MessageComponentTypes
} = require('../interfaces/Types');
const { Permissions, SnowflakeUtil } = require('discord.js');

class BaseInteraction extends Base {
	/**
	 * @param {Client}
	 * @param {APIInteraction | InteractionData}
	 */
	constructor(client, data = {}) {
		super(client);
		/**
		 * @type {InteractionType}
		 */
		this.type = typeof data.type === 'string' ? data.type : InteractionTypes[data.type];
		/**
		 * @type {Snowflake}
		 */
		this.id = data.id;
		/**
		 * @type {string}
		 * @readonly
		 */
		Object.defineProperty(this, 'token', {
			value: data.token
		});
		/**
		 * @type {Snowflake}
		 */
		this.applicationId = data.applicationId || data.application_id;
		/**
		 * @type {?Snowflake}
		 */
		this.channelId = data.channelId || data.channel_id || null;
		/**
		 * @type {?Snowflake}
		 */
		this.guildId = data.guildId || data.guild_id || null;
		/**
		 * @type {User}
		 */
		this.user = this.client.users.add(data.user || (data.member && data.member.user));
		/**
		 * @type {GuildMember}
		 */
		this.member = data.member
			? (this.guild && this.guild.members.add(data.member.user.id, data.member)) || data.member
			: null;
		/**
		 * @type {Snowflake}
		 */
		this.userId = data.member && data.member.user.id || data.user.id;
		/**
		 * @type {InteractionAuthor}
		 */
		this.author = new InteractionAuthor(this);
		/**
		 * @type {number}
		 */
		this.version = data.version;
		/**
		 * @type {?Readonly<Permissions>}
		 */
		this.memberPermissions = (data.member && data.member.permissions)
			? new Permissions(data.member.permissions).freeze()
			: null;
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
	 * @type {?TextBasedChannel}
	 * @readonly
	 */
	get channel() {
		return this.client.channels.get(this.channelId) || null;
	};
	/**
	 * @type {?Guild}
	 * @readonly
	 */
	get guild() {
		return this.client.guilds.get(this.guildId) || null;
	};
	/**
	 * @return {boolean}
	 */
	inGuild() {
		return Boolean(this.guildId && this.member);
	};
	/**
	 * @return {boolean}
	 */
	inCachedGuild() {
		return Boolean(this.guild && this.member);
	};
	/**
	 * @return {boolean}
	 */
	inRawGuild() {
		return Boolean(this.guildId && !this.guild && this.member);
	};
	/**
	 * @return {boolean}
	 */
	isApplicationCommand() {
		return InteractionTypes[this.type] === InteractionTypes.APPLICATION_COMMAND;
	};
	/**
	 * @return {boolean}
	 */
	isCommand() {
		return (
				InteractionTypes[this.type] === InteractionTypes.APPLICATION_COMMAND &&
				typeof this.targetId === 'undefined'
			);
	};
	/**
	 * @return {boolean}
	 */
	isContextMenu() {
		return (
				InteractionTypes[this.type] === InteractionTypes.APPLICATION_COMMAND &&
				typeof this.targetId !== 'undefined'
			);
	};
	/**
	 * @return {boolean}
	 */
	isAutocomplete() {
		return InteractionTypes[this.type] === InteractionTypes.APPLICATION_COMMAND_AUTOCOMPLETE;
	};
	/**
	 * @return {boolean}
	 */
	isMessageComponent() {
		return InteractionTypes[this.type] === InteractionTypes.MESSAGE_COMPONENT;
	};
	/**
	 * @return {boolean}
	 */
	isButton() {
		return (
				InteractionTypes[this.type] === InteractionTypes.MESSAGE_COMPONENT &&
				MessageComponentTypes[this.componentType] === MessageComponentTypes.BUTTON
			);
	};
	/**
	 * @return {boolean}
	 */
	isSelectMenu() {
		return (
				InteractionTypes[this.type] === InteractionTypes.MESSAGE_COMPONENT && 
				MessageComponentTypes[this.componentType] === MessageComponentTypes.SELECT_MENU
			);
	};
};

module.exports = BaseInteraction;