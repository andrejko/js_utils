const usage = (operation) => {
	switch (operation) {
		case 'remove-unpaired':
			return console.log('remove-unpaired usage');
		case 'adjust-dates':
			return console.log('adjust-dates usage');
		default:
			return console.log('usage');
	}
}

let bf = require('./batch-photos')
let operation = process.argv[2].replace('--', '')
let dir = process.argv[3]

switch (operation) {
	case 'remove-unpaired':
		let mainExt = process.argv[4]
		let pairExt = process.argv[5]
		let recursive = process.argv[6]

		if (typeof dir === 'undefined') {
			return usage(operation)
		}

		return bf.removeUnpaired(dir, mainExt, pairExt, recursive)
	case 'adjust-dates':
		if (typeof dir === 'undefined') {
			return usage(operation)
		}

		return bf.adjustDates(dir)
	default:
		return usage()
}