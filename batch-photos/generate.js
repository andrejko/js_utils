let async = require('async')
let fs = require('fs')
let path = require('path')
let _ = require('lodash')

let filesPath = 'D:/js_utils/test'
let indexes = _.range(20);

async.map(indexes, (index, callback) => {
	let mainExt = 'DNG'
	let pairExt = 'JPG'

	fs.writeFile(path.join(filesPath, 'file' + index + '.' + mainExt), null, () => {})
	
	if (Math.random() > 0.5) {
		fs.writeFile(path.join(filesPath, 'file' + index + '.' + pairExt), null, () => {})
	}
})