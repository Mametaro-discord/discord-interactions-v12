'use strict';

const CommandInteraction = require('./CommandInteraction');
const {
	ApplicationCommandOptionTypes,
	ApplicationCommandTypes
} = require('../interfaces/Types');

class ContextMenuInteraction extends CommandInteraction {
	/**
	 * @param {Client}
	 * @param {APIContextMenuInteraction | ContextMenuInteractionData}
	 */
	constructor(client, data = {}) {
		super(client, data);
		/**
		 * @type {Snowflake}
		 */
		this.targetId = data.data.targetId || data.data.target_id;
		/**
		 * @type {ApplicationCommandType}
		 */
		this.targetType = ApplicationCommandTypes[data.data.type];
	};
};