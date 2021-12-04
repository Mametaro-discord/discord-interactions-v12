'use strict';

const { APIMessage, MessageEmbed } = require('discord.js');
const BaseMessageComponent = require('../BaseMessageComponent');
const MessageActionRow = require('../MessageActionRow');
const MessageButton = require('../MessageButton');
const MessageSelectMenu = require('../MessageSelectMenu');

class ExtendedAPIMessage extends APIMessage {
	/**
	 * @return {this}
	 */
	resolveData() {
		if (this.data) {
			return this.data;
		};

		super.resolveData();

		if (this.options.content instanceof MessageEmbed) {
			this.data.embed = this.options.content;
			this.data.embeds.push(this.options.content);
			this.data.content = null;
		};

		if (this.options.flags) {
			this.data.flags = this.options.flags;
		};

		if (this.options.ephemeral) {
			this.data.flags = 1 << 64;
		};

		let components = [];
		let hasComponent = false;
		let hasActionRow = false;
		if (MessageComponentTypes[this.options.type]) {
			switch(this.options.type) {
				case MessageComponentTypes.ACTION_ROW:
				hasComponent = true;
				hasActionRow = true;
				components.push({
					type: MessageComponentTypes.ACTION_ROW,
					components: this.options.components.map(elm => BaseMessageComponent.create(elm))
				});
				break;

				case MessageComponentTypes.BUTTON:
				case MessageComponentTypes.SELECT_MENU:
				hasComponent = true;
				components.push({
					type: MessageComponentTypes.ACTION_ROW,
					components: [BaseMessageComponent.create(this.options)]
				});
				break;
			};
		};

		if (this.options.component) {
			hasComponent = true;
			if (this.options.component instanceof MessageActionRow) {
				hasActionRow = true;
				components.push({
					type: MessageComponentTypes.ACTION_ROW,
					components: this.options.component.components.map(elm => BaseMessageComponent.create(elm))
				});
			};

			if ((this.options.component instanceof MessageButton) || (this.options.component instanceof MessageSelectMenu)) {
				components.push({
					type: MessageComponentTypes.ACTION_ROW,
					components: [BaseMessageComponent.create(this.options.component)]
				});
			};
		};

		if (this.options.components) {
			hasComponent = true;
			if (Array.isArray(this.options.components)) {
				if (!hasActionRow) {
					this.components.forEach(elm => {
						let componentsAdd = [];
						elm.components.forEach(e => componentsAdd.push(BaseMessageComponent.create(e)));
						components.push({
							type: MessageComponentTypes.ACTION_ROW,
							components: componentsAdd
						});
					});
				};
			} else {
				components.push({
					type: MessageComponentTypes.ACTION_ROW,
					components: this.options.components.components.map(elm => BaseMessageComponent.create(elm))
				});
			};
		};

		if (this.options.button || this.options.buttons || this.options.menu || this.options.menus) {
			[this.options.button, this.options.buttons, this.options.menu, this.options.menus].forEach(elm => {
				if (!elm) return;
				hasComponent = true;
				components.push({
					type: MessageComponentTypes.ACTION_ROW,
					components: Array.isArray(elm)
					? elm.map(e => BaseMessageComponent.create(e))
					: [BaseMessageComponent.create(elm)]
				});
			});
		};

		const f = (
				this.options.component === null ||
				this.options.components === null ||
				this.options.button === null ||
				this.options.buttons === null ||
				this.options.menu === null ||
				this.options.menus === null
			);
		if (f) {
			hasComponent = true;
			components = [];
		};

		if ((typeof components.length === 'number') && hasComponent) {
			this.data.components = components.length === 0 ? [] : components;
		};

		return this;
	};
};

module.exports = ExtendedAPIMessage;