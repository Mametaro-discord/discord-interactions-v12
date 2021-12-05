'use strict';

const Base = require('./Base');

class InteractionAuthor extends Base {
	/**
	 * @param {Interaction}
	 */
	constructor(interaction) {
		super(interaction.client);
		/**
		 * @type {Interaction}
		 */
		this.interaction = interaction;
		/**
		 * @type {User}
		 */
		this.user = this.client.users.cache.get(interaction.userId);
		/**
		 * @type {?GuildMember}
		 */
		this.member = interaction.guild && interaction.guild.members.cache.get(interaction.userId);
	};
	/**
	 * @return {Promise<this>}
	 */
	async fetch() {
		this.user = this.client.users.fetch(this.interaction.userId);
		this.member = this.interaction.guild && this.interaction.guild.members.fetch(this.interaction.userId);
		return this;
	};
};

module.exports = InteractionAuthor;