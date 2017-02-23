const _ =  require('lodash');
const RemoveUnpaired = require('./RemoveUnpaired');
const DatesAdjust = require('./DatesAdjust');

class BatchPhotosProcessor {
	constructor(operation, parameters) {
		this.operation = operation;
		this.parameters = parameters;
	}

	executeOperation() {
		switch (this.operation) {
			case 'remove-unpaired':
				let remover = new RemoveUnpaired(this.parameters[0], this.parameters[1], this.parameters[2]);

				return remover.processDir();
			case 'adjust-dates':
				let adjuster = new DatesAdjust(this.parameters[0]);

				return adjuster.processDir();
			default:
				return usage();
		}
	}

	usage(operation) {
		switch (operation) {
			case 'remove-unpaired':
				return console.log('--remove-unpaired dir mainExt pairExt');
			case 'adjust-dates':
				return console.log('adjust-dates usage');
			default:
				return console.log('usage');
		}
	}
}

module.exports = BatchPhotosProcessor;