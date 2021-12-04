'use strict';

const BaseMessageComponent = require('BaseMessageComponent');

class MessageActionRow extends BaseMessageComponent {
	/**
	 * @param {APIMessageActionRow | MessageActionRowData}
	 * @optional {Client}
	 */
	constructor(data = {}, client) {
		super({
			type: 'ACTION_ROW'
		});
		/**
		 * @type {MessageActionRowComponent[]}
		 */
		this.components = (data.components && data.components.map(elm => BaseMessageComponent.create(elm))) || [];
	};
	/**
	 * @param {MessageActionRowComponent}
	 * @return {this}
	 */
	addComponent(component) {
		this.components.push(BaseMessageComponent.create(components));
		return this;
	};
	/**
	 * @param {MessageActionRowComponent[]}
	 * @return {this}
	 */
	addComponents(components) {
		components.forEach(elm => this.components.push(BaseMessageComponent.create(elm)));
		return this;
	};
	/**
	 * @param {MessageActionRowComponent[]}
	 * @return {this}
	 */
	setComponents(components) {
		this.spliceComponents(0, this.components.length, ...components);
		return this;
	};
	/**
	 * @optional {number}
	 * @optional {number}
	 * @optional {MessageActionRowComponent[]}
	 * @return {this}
	 */
	spliceComponents(index, deleteCount, components) {
		components = components.map(elm => BaseMessageComponent.create(elm));
		this.components.splice(index, deleteCount, ...components);
		return this;
	};
	/**
	 * @return {APIMessageComponent}
	 */
	toJSON() {
		return {
			components: this.components.map(elm => elm.toJSON),
			type: MessageComponentTypes[this.type]
		};
	};
};

module.exports = MessageActionRow;