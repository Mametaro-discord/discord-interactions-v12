'use strict';

const {
	Client,
	DMChannel,
	Guild,
	Message,
	MessageFlags,
	NewsChannel,
	TextChannel,
	Structures
} = require('discord.js');

const ExtendedDMChannel = require('./structures/extended/ExtendedDMChannel');
const ExtendedGuild = require('./structures/extended/ExtendedGuild');
const ExtendedMessage = require('./structures/extended/ExtendedMessage');
const ExtendedNewsChannel = require('./structures/extended/ExtendedNewsChannel');
const ExtendedTextChannel = require('./structures/extended/ExtendedTextChannel');

const ApplicationCommandManager = require('./managers/ApplicationCommandManager');

/**
 * @param {Client}
 * @return {undefined}
 */
function main(client) {
	if (!client | !(client instanceof Client)) throw new Error('The argument must be an instance of Client');
	client.commands = ApplicationCommandManager(client);

	extend();
};

/**
 * @return {undefined}
 */
function extend() {
	Object.assign(MessageFlags, {
		HAS_THREAD: 1 << 5,
		EPHEMERAL: 1 << 6,
		LOADING: 1 << 7
	});

	Structures.extend('DMChannel', () => ExtendedDMChannel);
	Structures.extend('Guild', () => ExtendedGuild);
	Structures.extend('Message', () => ExtendedMessage);
	Structures.extend('NewsChannel', () => ExtendedNewsChannel);
	Structures.extend('TextChannel', () => ExtendedTextChannel);

	Object.assign(DMChannel, ExtendedDMChannel);
	Object.assign(Guild, ExtendedGuild);
	Object.assign(Message, ExtendedMessage);
	Object.assign(NewsChannel, ExtendedNewsChannel);
	Object.assign(TextChannel, ExtendedChannel);
};

const extended = {
	ExtendedAPIMessage: require('./structures/extended/ExtendedAPIMessage'),
	ExtendedDMChannel,
	ExtendedGuild,
	ExtendedMessage,
	ExtendedNewsChannel,
	ExtendedTextChannel,
	ExtendedWebhookClient: require('./structures/extended/ExtendedWebhookClient')
};

const structures = {
	ApplicationCommand: require('./structures/ApplicationCommand'),
	AutocompleteInteraction: require('./structures/AutocompleteInteraction'),
	Base: require('./structures/Base'),
	BaseInteraction: require('./structures/BaseInteraction'),
	BaseMessageComponent: require('./structures/BaseMessageComponent'),
	ComamndInteraction: require('./structures/CommandInteraction'),
	ContextMenuInteraction: require('./structures/ContextMenuInteraction'),
	InteractionAuthor: require('./structures/InteractionAuthor'),
	InteractionCollector: require('./structures/InteractionController'),
	InteractionReply: require('./structures/InteractionReply'),
	MessageActionRow: require('./structures/MessageActionRow'),
	MessageButton: require('./structures/MessageButton'),
	MessageComponentInteraction: require('./structures/MessageComponentInteraction'),
	MessageSelectMenu: require('./structures/MessageSelectMenu')
};

const managers = {
	ApplicationCommandManager,
	ApplicationCommandPermissionsManager: require('./managers/ApplicationCommandPermissionsManager'),
	GuildApplicationCommandManager: require('./managers/GuildApplicationCommandManager')
};

module.exports = Object.assign(main, extended, structures, managers);