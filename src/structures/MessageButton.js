'use strict';

const BaseMessageComponent = require('BaseMessageComponent');
const {
	MessageButtonStyles,
	MessageComponentTypes
} = require('../interfaces/Types');
const DJSUtil = require('discord.js').Util;

class MessageButton extends BaseMessageComponent {
	/**
	 * @param {APIMessageButton | MessageButtonData}
	 */
	constructor(data) {
		super({
			type: 'BUTTON'
		});

		this.patch(data);
	};
	/**
	 * @param {APIMessageButton | MessageButtonData}
	 * @return {undefined}
	 */
	patch(data = {}) {
		/**
		 * @type {?string}
		 */
		this.label = data.label || null;
		/**
		 * @type {?string}
		 */
		this.customId = data.custom_id || data.customId || null;
		/**
		 * @type {?MessageButtonStyle}
		 */
		this.style = data.style ? this.constructor.resolveStyle(data.style) : null;
		/**
		 * @type {?RawEmoji}
		 */
		this.emoji = data.emoji ? DJSUtil.resolvePartialEmoji(data.emoji) : null;
		/**
		 * @type {?string}
		 */
		this.url = data.url || null;
		/**
		 * @type {boolean}
		 */
		this.disabled = data.disabled || false;
	};
	/**
	 * @param {string}
	 * @return {this}
	 */
	setLabel(label) {
		this.label = label;
		return this;
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
	 * @param {MessageButtonStyle}
	 * @return {this}
	 */
	setStyle(style) {
		this.style = style;
		return this;
	};
	/**
	 * @param {EmojiIdentifierResolvable} djs type
	 * @return {this}
	 */
	setEmoji(emoji) {
		this.emoji = DJSUtil.resolvePartialEmoji(emoji);
		return this;
	};
	/**
	 * @param {string}
	 * @return {this}
	 */
	setURL(url) {
		this.url = url;
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
	 * @return {APIMessageButton}
	 */
	toJSON() {
		return {
			custom_id: this.customId,
			disabled: this.disabled,
			emoji: this.emoji,
			label: this.label,
			style: MessageButtonStyles[this.style],
			type: MessageComponentTypes[this.type],
			url: this.url
		};
	};
	/**
	 * @param {MessageButtonStyleResolvable}
	 * @optional {boolean} whether the result is for the API
	 * @return {MessageButtonStyle}
	 */
	static resolveStyle(style, toAPI) {
		if (!style) return style;
		if (style === 'blue') style = 'blurple';
		if (style === 'gray') style = 'grey';
		if (toAPI) {
			return typeof style === 'number' ? style : MessageButtonStyles[style];
 		} else {
 			return typeof style === 'string' ? style : MessageButtonStyles[style];
 		};
	};
};

module.exports = MessageButton;