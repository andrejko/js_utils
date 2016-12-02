let fs = require("fs")
let path = require("path")
let async = require('async')

_checkIfAccessible = (filePath, callback) => {
	fs.access(filePath, fs.f_OK, (err) => {
		if (err !== null) {
			/*fs.unlink(filePath, function(e) {
				if (e === null) {
					processedFiles.push(filePath + ' --- removed')
				} else {
					console.log(e)
				}
			})*/
		}
	})
}

_checkIfPaired = (filePath, mainExt, pairExt, callback) => {
	console.log('_checkIfPaired', filePath, mainExt, pairExt, callback)
	/*fs.stat(filePath, function(err, stats) {
		if (stats.isFile()) {
			let ext = path.extname(filePath).substr(1)
			let basename = path.basename(filePath, ext)

			if (ext.toLowerCase() == pairExt.toLowerCase()) {
				let filesToCheck = [path.join(path.dirname(filePath), basename + mainExt), path.join(path.dirname(filePath), basename + 'JPG')]
				async.each(filesToCheck, _checkIfAccessible)
			}
		}
	})*/
}

module.exports = {
	removeUnpaired: (dir, mainExt = 'jpg', pairExt = 'dng', recursive = false) => {
		let processedFiles = []

		if (typeof dir === 'undefined') {
			console.log('Param [1] should be existing directory')
			process.exit()
		}

		if (typeof pairExt === 'undefined') {
			console.log('Param [2] should be extension to remove')
			process.exit()
		}

		fs.readdir(dir, (err, files) => {
			if (err) {
				return console.log(err)
			}

			async.map(files, (file, callback) => {
				_checkIfPaired(path.join(dir, file), mainExt, pairExt, (err, result) => {
					return callback(err, result)
				})
			}, (err, results) => {
				console.log(results)
			})
		})

		return processedFiles
	}
}