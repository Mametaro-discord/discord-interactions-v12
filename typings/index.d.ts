import {
	Client,
	Snowflake
} from 'discord.js';

export type ApplicationCommandTypes = 'CHAT_INPUT' | 'USER' | 'MESSAGE'

export type ApplicationCommandPermissionTypes = 'ROLE' | 'USER'

export type ApplicationCommandOptionTypes = 'SUB_COMMAND' | 'SUB_COMMAND_GROUP' | 'STRING' | 'INTEGER' | 'BOOLEAN' | 'USER' | 'CHANNEL' | 'ROLE' | 'MENTIONABLE' | 'NUMBER'

export type ChannelTypes = 'GUILD_TEXT' | 'DM' | 'GUILD_VOICE' | 'GROUP_DM' | 'GUILD_CATEGORY' | 'GUILD_NEWS' | 'GUILD_STORE' | 'GUILD_NEWS_THREAD' | 'GUILD_PUBLIC_THREAD' | 'GUILD_PRIVATE_THREAD' | 'GUILD_STAGE_VOICE'

export type InteractionTypes = 'PING' | 'APPLICATION_COMMAND' | 'MESSAGE_COMPONENT' | 'APPLICATION_COMMAND_AUTOCOMPLETE'

export type InteractionReplyTypes = 'PONG' | 'CHANNEL_MESSAGE_WITH_SOURCE' | 'DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE' | 'DEFERRED_UPDATE_MESSAGE' | 'UPDATE_MESSAGE' | 'APPLICATION_COMMAND_AUTOCOMPLETE_RESULT'

export type MessageButtonStyles = 'blurple' | 'grey' | 'green' | 'red' | 'url'

export type MessageComponentTypes = 'ACTION_ROW' | 'BUTTON' | 'SELECT_MENU'