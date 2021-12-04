'use strict';

const BaseMessageComponent = require('./BaseMessageComponent');
const {
	MessageComponentTypes
} = require('../interfaces/Types');
const DJSUtil = require('discord.js').Util;

class MessageSelectMenu extends BaseMessageComponent {
	/**
	 * @param {APIMessageSelectMenu | MessageSelectMenuData}
	 */
	constructor(data) {
		super({
			type: 'SELECT_MENU'
		});

		this.patch(data);
	};
	/**
	 * @param {APIMessageSelectMenu | MessageSelectMenuData}
	 * @return {undefined}
	 */
	patch(data = {}) {
		/**
		 * @type {?string}
		 */
		this.customId = data.customId || data.custom_id || null;
		/**
		 * @type {?string}
		 */
		this.placeholder = data.placeholder || null;
		/**
		 * @type {?number}
		 */
		this.minValues = data.minValues || data.min_values || null;
		/**
		 * @type {?number}
		 */
		this.maxValues = data.maxValues || data.max_values || null;
		/**
		 * @type {MessageSelectOption[]}
		 */
		this.options = data.options || [];
		/**
		 * @type {boolean}
		 */
		this.disabled = data.disabled || false;
	};
	/**
	 * @param {string}
	 * @return {this}
	 */
	setCustomId(customId) {
		this.customId = customId;
		return this;
	};
	/**
	 * @param {string}
	 * @return {this}
	 */
	setPlaceholder(placeholder) {
		this.placeholder = placeholder;
		return this;
	};
	/**
	 * @param {number}
	 * @return {this}
	 */
	setMinValues(minValues) {
		this.minValues = minValues;
		return this;
	};
	/**
	 * @param {number}
	 * @return {this}
	 */
	setMaxValues(maxValues) {
		this.maxValues = maxValues;
		return this;
	};
	/**
	 * @param {MessageSelectOptionData}
	 * @return {this}
	 */
	addOption(option) {
		this.options.push(option);
		return this;
	};
	/**
	 * @param {MessageSelectOptionData[]}
	 * @return {this}
	 */
	addOptions(options = []) {
		options.forEach(elm => this.options.push(elm));
		return this;
	};
	/**
	 * @param {MessageSelectOptionData[]}
	 * @return {this}
	 */
	setOptions(options = []) {
		this.spliceOptions(0, this.options.length, options);
		return this;
	}
	/**
	 * @param {number}
	 * @param {number}
	 * @param {MessageSelectOptionData[]}
	 * @return {this}
	 */
	spliceOptions(index, deleteCount, options = []) {
		this.options.splice(index, deleteCount, ...options);
		return this;
	};
	/**
	 * @optional {boolean}
	 * @return {this}
	 */
	setDisabled(disabled = true) {
		this.disabled = disabled;
		return this;
	};
	/**
	 * @return {APIMessageSelectMenu}
	 */
	toJSON() {
		return {
			custom_id: this.customId,
			disabled: this.disabled,
			max_values: this.maxValues || (this.minValues ? this.options.length : undefined),
			min_values: this.min_values,
			options: this.options,
			placeholder: this.placeholder,
			type: MessageComponentTypes[this.type]
		};
	};
	/**
	 * @param {MessageSelectOptionData | MessageSelectOptionData[]}
	 * @return {MessageSelectOption | MessageSelectOption[]}
	 */
	static transformOptions(options) {
		let target;
		if (!Array.isArray(options)) target = [options];

		target.forEach(elm => {
			elm.emoji = elm.emoji ? DJSUtil.resolvePartialEmoji(elm.emoji) : null;
			elm.default = elm.default || false;
		});

		return Array.isArray(options) ? target : target.shift();
	};
};

module.exports = MessageSelectMenu;