const fs = require('fs');
const Types = require('../src/interfaces/Types');

let arr = [];

for (i in Types) {
	arr.push(
			`export type ${i} = ` + 
			Object.keys(Types[i])
				.filter(elm => !elm.match(/[0-9]+/))
				.map(elm => `\'${elm}\'`)
				.join(' | ') + ';'
		);
};

const content = arr.join('\n\n');
fs.writeFileSync('Types.txt', content);