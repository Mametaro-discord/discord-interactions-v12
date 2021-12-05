import type {
	APIMessage,
	BaseManager,
	Client,
	Collector,
	Collection,
	DMChannel,
	EmojiIdentifierResolvable,
	Guild,
	GuildChannel,
	GuildMember,
	Message,
	MessageOptions,
	NewsChannel,
	Permissions,
	RawEmoji,
	Snowflake,
	StringResolvable,
	TextChannel,
	User,
	WebhookClient
} from 'discord.js';

export type TextBasedChannels = DMChannel | NewsChannel | TextChannel;

declare type Arrayor<src> = src | src[];
declare type Collectionor<src, key = Snowflake> = src | Collection<key, src>;

export type ApplicationCommandType = 'CHAT_INPUT' | 'USER' | 'MESSAGE';

export type ApplicationCommandPermissionType = 'ROLE' | 'USER';

export type ApplicationCommandOptionType = 'SUB_COMMAND' | 'SUB_COMMAND_GROUP' | 'STRING' | 'INTEGER' | 'BOOLEAN' | 'USER' | 'CHANNEL' | 'ROLE' | 'MENTIONABLE' | 'NUMBER';

export type ChannelType = 'GUILD_TEXT' | 'DM' | 'GUILD_VOICE' | 'GROUP_DM' | 'GUILD_CATEGORY' | 'GUILD_NEWS' | 'GUILD_STORE' | 'GUILD_NEWS_THREAD' | 'GUILD_PUBLIC_THREAD' | 'GUILD_PRIVATE_THREAD' | 'GUILD_STAGE_VOICE';

export type InteractionType = 'PING' | 'APPLICATION_COMMAND' | 'MESSAGE_COMPONENT' | 'APPLICATION_COMMAND_AUTOCOMPLETE';

export type InteractionReplyType = 'PONG' | 'CHANNEL_MESSAGE_WITH_SOURCE' | 'DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE' | 'DEFERRED_UPDATE_MESSAGE' | 'UPDATE_MESSAGE' | 'APPLICATION_COMMAND_AUTOCOMPLETE_RESULT';

export type MessageButtonStyle = 'blurple' | 'grey' | 'green' | 'red' | 'url';

export type MessageButtonStyleResolvable = MessageButtonStyle | 'blue' | 'gray';

export type MessageComponentType = 'ACTION_ROW' | 'BUTTON' | 'SELECT_MENU';

export type MessageComponentTypeResolvable = MessageComponentType | 1 | 2 | 3;

export type ApplicationCommandOptionChoice = {
	name: string,
	value: number | string
}

export type FetchApplicationCommandOptions = {
	cache: boolean,
	force: boolean,
	guildId?: Snowflake,
}

export type PathApplicationCommandOptions = {
	commandId?: Snowflake,
	guildId?: Snowflake
}

export type APIApplicationCommand = {
	application_id: Snowflake,
	default_permission: boolean,
	description: string,
	guild_id: Snowflake,
	id: Snowflake,
	name: string,
	options: ApplicationCommandOption[],
	type?: ApplicationCommandType,
	version: Snowflake
}

export type ApplicationCommandData = {
	default_permission?: boolean,
	description: string,
	name: string,
	options?: ApplicationCommandOption[],
	type?: ApplicationCommandType
}

export type ApplicationCommandOption = {
	autocomplete?: boolean
	channel_types?: ChannelType[],
	choices?: ApplicationCommandOptionChoice[],
	description: string,
	max_value?: number,
	min_value?: number,
	name: string,
	options?: ApplicationCommandOption[],
	required?: boolean,
	type: ApplicationCommandOptionType
}

export type ApplicationCommandResolvable = ApplicationCommand | Snowflake;

export type CommandData = APIApplicationCommand | ApplicationCommandData;

export type CommandManager = ApplicationCommandManager | GuildApplicationCommandManager;

export type AddApplicationCommandPermissionsOptions = PathApplicationCommandOptions & {
	permissions: ApplicationCommandPermissions[]
}

export type FetchApplicationCommandPermissionsOptions = PathApplicationCommandOptions;

export type RemoveApplicationCommandPermissionsOptions = PathApplicationCommandOptions & {
	roles?: Arrayor<Snowflake>,
	users?: Arrayor<Snowflake>
}

declare type SubSetApplicationCommandPermissionsOptions = PathApplicationCommandOptions & {
	permissions: ApplicationCommandPermissions[]
}
declare type FullSetApplicationCommandPermissionsOptions = {
	fullPermissions: FullPermissions[]
}
export type SetApplicationCommandPermissionsOptions = SubSetApplicationCommandPermissionsOptions | FullSetApplicationCommandPermissionsOptions;

export type ApplicationCommandPermissions = {
	id: Snowflake,
	permissions: boolean,
	type: ApplicationCommandPermissionType
}

export type FullPermissions = {
	id: Snowflake,
	permissions: ApplicationCommandPermissions[]
}

export class Base {
	protected constructor(client: Client);
	public readonly client: Client;
}

export class ApplicationCommand extends Base {
	protected constructor(client: Client, data: CommandData, guild: Guild, guildId: Snowflake);
	public applicationId: Snowflake;
	public id: Snowflake;
	public guild?: Guild;
	public guildId?: Snowflake;
	public permissions: ApplicationCommandPermissionsManager;
	public type: ApplicationCommandType;
	get createdTimestamp(): number;
	get createdAt(): Date;
	get manager(): CommandManager;
	patch(data: CommandData): void;
	edit(data: ApplicationCommandData): Promise<ApplicationCommand>;
	delete(): Promise<ApplicationCommand>;
	static transformOptions(options: Arrayor<CommandData>): Arrayor<ApplicationCommandOption>;
}

declare class OverridableManager<Key, Holds, Resolvable> extends BaseManager<Key, Holds, Resolvable> {
	public add(...args: any[]): any;
}

export class ApplicationCommandManager extends OverridableManager<Snowflake, ApplicationCommand, ApplicationCommandResolvable> {
	protected constructor(client: Client);
	public permissions: ApplicationCommandPermissionsManager;
	add(data: CommandData, cache?: boolean, guildId?: Snowflake): ApplicationCommand;
	commandPath(options: PathApplicationCommandOptions): Object;
	create(data: CommandData, guildId?: Snowflake): Promise<ApplicationCommand>;
	set(commands: CommandData[], guildId?: Snowflake): Promise<Collection<Snowflake, ApplicationCommand>>;
	fetch(commandId: Snowflake | FetchApplicationCommandOptions, options?: FetchApplicationCommandOptions): Promise<Collectionor<ApplicationCommand>>;
	edit(commandId: Snowflake, data: CommandData, guildId?: Snowflake): Promise<ApplicationCommand>;
	delete(commandId: Snowflake, guildId?: Snowflake): Promise<ApplicationCommand>;
}

export class GuildApplicationCommandManager extends ApplicationCommandManager {
	public guild: Guild;
	public guildId: Snowflake;
	public permissions: ApplicationCommandPermissionsManager;
}

export class ApplicationCommandPermissionsManager extends Base {
	public commandId?: Snowflake;
	public guild?: Guild;
	public guildId?: Snowflake;
	public manager: ApplicationCommand | CommandManager;
	get command(): ApplicationCommand | void;
	permissionsPath(guildId?: Snowflake, commandId?: Snowflake): Object;
	fetch(options: FetchApplicationCommandPermissionsOptions): Promise<Collectionor<ApplicationCommandPermissions[]>>;
	set(options: SetApplicationCommandPermissionsOptions): Promise<Collectionor<ApplicationCommandPermissions[]>>;
	add(options: AddApplicationCommandPermissionsOptions): Promise<ApplicationCommandPermissions[]>;
	remove(options: RemoveApplicationCommandPermissionsOptions): Promise<ApplicationCommandPermissions[]>;
}

export type APIMessageActionRow = {
	components: APIMessageButton[] | APIMessageSelectMenu[]
	type: MessageComponentType
}

export type MessageActionRowData = {
	components: ActionRowComponent[]
}

export type ActionRowData = APIMessageActionRow | MessageActionRowData;

export type APIMessageButton = {
	custom_id?: string,
	disabled?: boolean,
	emoji?: EmojiIdentifierResolvable,
	label?: string,
	style: MessageButtonStyle,
	type: MessageComponentType,
	url?: string
}

export type MessageButtonData = {
	customId?: string,
	disabled?: boolean,
	emoji?: EmojiIdentifierResolvable,
	label?: string,
	style: MessageButtonStyle,
	url?: string
}

export type ButtonData = APIMessageButton | MessageButtonData;

export type APIMessageSelectMenu = {
	custom_id: string,
	disabled?: number,
	max_values?: number,
	min_values?: number,
	options: APIMessageSelectOption[],
	placeholder?: string,
	type: MessageComponentType
}

export type MessageSelectMenuData = {
	customId: string,
	disabled?: boolean,
	maxValues?: number,
	minValues?: number,
	options: MessageSelectOptionData[],
	placeholder?: string
}

export type MessageSelectOption = {
	default?: boolean,
	description?: string,
	emoji?: RawEmoji,
	label: string,
	value: string
}

export type APIMessageSelectOption = MessageSelectOption;

export type MessageSelectOptionData = {
	default?: boolean,
	description?: string,
	emoji?: EmojiIdentifierResolvable,
	label: string,
	value: string
}

export type SelectMenuData = APIMessageSelectMenu | MessageSelectMenuData;

export type APIMessageComponent = APIMessageActionRow | APIMessageButton | APIMessageSelectMenu;

export type MessageComponentData = MessageActionRowData | MessageButtonData | MessageSelectMenuData;

export type ComponentData = APIMessageComponent | MessageComponentData;

export type APIActionRowComponent = APIMessageButton | APIMessageSelectMenu;

export type ActionRowComponent = MessageButton | MessageSelectMenu;

export type MessageComponent = ActionRowComponent | MessageActionRow;

export class BaseMessageComponent {
	protected constructor(data: ComponentData);
	public type: MessageComponentType;
	static create(data: ComponentData, client?: Client): MessageComponent;
}

export class MessageActionRow extends BaseMessageComponent {
	protected constructor(data: ActionRowData, client?: Client);
	public components: ActionRowComponent[];
	addComponent(component: ActionRowComponent): this;
	addComponents(components: ActionRowComponent[]): this;
	setComponents(components: ActionRowComponent[]): this;
	spliceComponents(index: number, deleteCount: number, components: ActionRowComponent[]): this;
	toJSON(): APIMessageActionRow;
}

export class MessageButton extends BaseMessageComponent {
	protected constructor(data: ButtonData);
	public customId?: string;
	public disabled?: boolean;
	public emoji?: RawEmoji;
	public label?: string;
	public style?: MessageButtonStyle;
	public url?: string;
	setLabel(label: string): this;
	setCustomId(customId: string): this;
	setStyle(style: MessageButtonStyle): this;
	setEmoji(emoji: EmojiIdentifierResolvable): this;
	setURL(url: string): this;
	setDisabled(disabled?: boolean): this;
	toJSON(): APIMessageButton;
	static resolveStyle(style: MessageButtonStyleResolvable, toAPI: boolean): MessageButtonStyle;
}

export class MessageSelectMenu extends BaseMessageComponent {
	protected constructor(data: SelectMenuData);
	public customId?: string;
	public disabled?: boolean;
	public maxValues?: number;
	public minValues?: number;
	public options: MessageSelectOption[];
	public placeholder?: string;
	setCustomId(customId: string): this;
	setPlaceholder(placeholder: string): this;
	setMinValues(minValues: number): this;
	setMaxValues(maxValues: number): this;
	setDisabled(disabled?: boolean): this;
	addOption(option: MessageSelectOptionData): this;
	addOptions(options: MessageSelectOptionData[]): this;
	setOptions(options: MessageSelectOptionData[]): this;
	spliceOptions(index: number, deleteCount: number, options: MessageSelectOptionData[]): this;
	toJSON(): APIMessageSelectMenu;
	static transformOptions(options: Arrayor<MessageSelectOptionData>): Arrayor<MessageSelectOption>
}

export type APIAutocompleteInteraction = {}

export type AutocompleteInteractionData = {}

export type AutocompleteOption = {
	focused?: boolean,
	name: string,
	value?: any,
	type: ApplicationCommandOptionType
}

export type APICommandInteraction = {}

export type CommandInteractionData = {}

export type APIContextMenuInteraction = {}

export type ContextMenuInteractionData = {}

export type APIMessageComponentInteraction = {}

export type MessageComponentInteractionData = {}

export type APIInteraction = APIAutocompleteInteraction | APICommandInteraction | APIContextMenuInteraction | APIMessageComponentInteraction;

export type InteractionData = AutocompleteInteractionData | CommandInteractionData | ContextMenuInteractionData | MessageComponentInteractionData;

export type ResponsableInteraction = CommandInteraction | ContextMenuInteraction | MessageComponentInteraction; 

export type Interaction = AutocompleteInteraction | ResponsableInteraction;

export type InteractionCollectorFilter = (interaction) => boolean;

export type InteractionCollectorOptions = {}

export class InteractionAuthor extends Base {
	protected constructor(interaction: Interaction);
	public interaction: Interaction;
	public member?: GuildMember;
	public user?: User;
	fetch(): Promise<this>;
}

export class InteractionReply extends Base {
	protected constructor(interaction: ResponsableInteraction, webhook: ExtendedWebhookClient);
	public deferred: boolean;
	public ephemeral: boolean;
	public interaction: ResponsableInteraction;
	public replied: boolean;
	public webhook: ExtendedWebhookClient;
	get isEphemeral(): boolean;
	send(content: StringResolvable, options?: MessageOptions): Promise<this>;
	edit(content: StringResolvable, options?: MessageOptions): Promise<this>;
	defer(ephemeral: boolean): Promise<this>;
	deferUpdate(ephemeral: boolean): Promise<this>;
	fetch(): Promise<APIMessage | Message>;
	delete(): Promise<void>;
}

export class BaseInteraction extends Base {
	protected constructor(client: Client, data: InteractionData);
	public applicationId: Snowflake;
	public author: InteractionAuthor;
	public channelId?: Snowflake;
	public guildId?: Snowflake;
	public id: Snowflake;
	public member?: GuildMember;
	public memberPermissions?: Readonly<Permissions>;
	public readonly token: string;
	public type: InteractionType;
	public user: User;
	public userId: Snowflake;
	public version: number;
	get createdTimestamp(): number;
	get createdAt(): Date;
	get channel(): TextBasedChannels;
	get guild(): Guild;
	inGuild(): boolean;
	inCachedGuild(): boolean;
	inRawGuild(): boolean;
	isApplicationCommand(): boolean;
	isCommand(): boolean;
	isContextMenu(): boolean;
	isAutocomplete(): boolean;
	isMessageComponent(): boolean;
	isButton(): boolean;
	isSelectMenu(): boolean;
}

export class AutocompleteInteraction extends BaseInteraction {
	protected constructor(client: Client, data: APIAutocompleteInteraction | AutocompleteInteractionData);
	public commandId: Snowflake;
	public commandName: string;
	public options: AutocompleteOption[];
	public responeded: boolean;
	get command(): ApplicationCommand;
	respond(choices: ApplicationCommandOptionChoice[]): Promise<void>;
	static transformOptions(options: Arrayor<AutocompleteOption>): Arrayor<AutocompleteOption>;
}

export class CommandInteraction extends BaseInteraction {
	protected constructor(client: Client, data: APICommandInteraction | CommandInteractionData);
	public commandId: Snowflake;
	public commandName: string;
	public options: ApplicationCommandOption[];
	public reply: InteractionReply;
	public webhook: ExtendedWebhookClient;
	get ephemeral(): boolean;
	get isEphemeral(): boolean;
	get deferred(): boolean;
	get replied(): boolean;
	get command(): ApplicationCommand;
}

export class ContextMenuInteraction extends CommandInteraction {
	protected constructor(client: Client, data: APIContextMenuInteraction | ContextMenuInteractionData);
	public targetId: Snowflake;
	public targetType: ApplicationCommandType
}

export class MessageComponentInteraction extends BaseInteraction {
	protected constructor(client: Client, data: APIMessageComponent | MessageComponentData);
	public componentType: MessageComponentType;
	public customId: string;
	public message: APIMessage | Message;
	public reply: InteractionReply;
	public webhook: ExtendedWebhookClient;
	get component(): APIActionRowComponent;
	get ephemeral(): boolean;
	get isEphemeral(): boolean;
	get deferred(): boolean;
	get replied(): boolean;
	static resolveComponents(components: APIMessageComponent[]): MessageComponent[];
	static resolveType(type: MessageComponentTypeResolvable, toAPI: boolean): MessageComponentType;
}

export class InteractionCollector extends Collector {
	protected constructor(client: Client, filter: InteractionCollectorFilter, options: InteractionCollectorOptions);
	public channelId?: Snowflake;
	public componentType?: MessageComponentType;
	public guildId?: Snowflake;
	public interactionType?: InteractionType;
	public messageId?: Snowflake;
	public total: number;
	public users: Collection<User>;
	get endReason(): string;
	collect(interaction: Interaction): Snowflake;
	dispose(interaction: Interaction): Snowflake;
	end(): void;
	handleMessageDeletion(message: Message): void;
	handleChannelDeletion(channel: GuildChannel): void;
	handleGuildDeletion(guild: Guild): void;
}

export class ExtendedAPIMessage extends APIMessage {
	resolveData(): this;
}

export class ExtendedDMChannel extends DMChannel {
	send(content: StringResolvable, options?: MessageOptions): APIMessage | Message;
	createMessageComponentCollector(filter: InteractionCollectorFilter, options?: InteractionCollectorOptions): InteractionCollector;
	awaitMessageComponent(filter: InteractionCollectorFilter, options?: InteractionCollectorOptions): Promise<MessageComponentInteraction>;
}

export class ExtendedNewsChannel extends NewsChannel {
	send(content: StringResolvable, options?: MessageOptions): APIMessage | Message;
	createMessageComponentCollector(filter: InteractionCollectorFilter, options?: InteractionCollectorOptions): InteractionCollector;
	awaitMessageComponent(filter: InteractionCollectorFilter, options?: InteractionCollectorOptions): Promise<MessageComponentInteraction>;
}

export class ExtendedTextChannel extends TextChannel {
	send(content: StringResolvable, options?: MessageOptions): APIMessage | Message;
	createMessageComponentCollector(filter: InteractionCollectorFilter, options?: InteractionCollectorOptions): InteractionCollector;
	awaitMessageComponent(filter: InteractionCollectorFilter, options?: InteractionCollectorOptions): Promise<MessageComponentInteraction>;
}

export class ExtendedMessage extends Message {
	_patch(data: APIMessage): void;
	createMessageComponentCollector(filter: InteractionCollectorFilter, options?: InteractionCollectorOptions): InteractionCollector;
	awaitMessageComponent(filter: InteractionCollectorFilter, options?: InteractionCollectorOptions): Promise<MessageComponentInteraction>;
	edit(content: StringResolvable, options?: MessageOptions): Promise<Message>;
}

export class ExtendedWebhookClient extends WebhookClient {
	sendMessage(content: StringResolvable, options?: MessageOptions): Promise<APIMessage>;
	editMessage(id: string, content: StringResolvable, options?: MessageOptions): Promise<APIMessage>;
	deleteMessage(id: string): Promise<void>;
	fetchMessage(id: string): Promise<APIMessage>;
}