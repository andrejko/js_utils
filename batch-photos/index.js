const BatchPhotosProcessor = require('./BatchPhotosProcessor');

let operation = process.argv[2].replace('--', '');
let parameters = process.argv.slice(3);

photoProcessor = new BatchPhotosProcessor(operation, parameters);
photoProcessor.executeOperation();