const usage = (operation) => {
	switch (operation) {
		case 'remove-unpaired':
			return console.log('remove-unpaired usage');
		default:
			return console.log('usage');
	}
}

let bf = require('./batch-photos')
let operation = process.argv[2].replace('--', '');

switch (operation) {
	case 'remove-unpaired':
		let dir = process.argv[3]
		let mainExt = process.argv[4]
		let pairExt = process.argv[5]
		let recursive = process.argv[6]

		if (typeof dir === 'undefined') {
			return usage(operation)
		}

		return bf.removeUnpaired(dir, mainExt, pairExt, recursive)
	default:
		return usage()
}