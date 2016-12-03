let fs = require("fs")
let path = require("path")
let async = require('async')
let _ = require('lodash')

_checkIfAccessible = (filePath, callback) => {
	fs.access(filePath, fs.f_OK | fs.W_OK, (err) => {
		callback(null, !err)
	})
}

_checkIfPaired = (filePath, pairExt, callback) => {
	let ext = path.extname(filePath).substr(1)
	let basename = path.basename(filePath, ext)
	let filesToCheck = [
		path.join(path.dirname(filePath), basename + pairExt),
		path.join(path.dirname(filePath), basename + 'JPG')
	]

	async.some(filesToCheck, _checkIfAccessible, (err, result) => {
		callback(err, result)
	})
}

module.exports = {
	removeUnpaired: (dir, mainExt = 'dng', pairExt = 'jpg', recursive = false, callback) => {
		let removedFiles = []

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

			files = files.filter((fileName) => {
				return (path.extname(fileName).substr(1).toLowerCase() == mainExt.toLowerCase())
			})

			async.map(files, (file, callback) => {
				let filePath = path.join(dir, file)

				_checkIfPaired(filePath, pairExt, (err, isPaired) => {
					if (!isPaired) {
						fs.unlink(filePath, (err) => {
							console.log(filePath + ' removed')
						})
					}

					callback(null)
				})
			})
		})
	}
}