let fs = require("fs")
let path = require("path")
let async = require('async')
let _ = require('lodash')

_checkIfAccessible = (filePath, callback) => {
	fs.access(filePath, fs.f_OK, (err) => {
		callback(err, filePath)
		/*fs.unlink(filePath, function(e) {
			if (e === null) {
				processedFiles.push(filePath + ' --- removed')
			} else {
				console.log(e)
			}
		})*/
	})
}

_checkIfPaired = (filePath, mainExt, pairExt, callback) => {
	fs.stat(filePath, (err, stats) => {
		if (err) {
			return callback(err)
		}

		if (stats.isFile()) {
			let ext = path.extname(filePath).substr(1)
			let basename = path.basename(filePath, ext)

			let filesToCheck = [path.join(path.dirname(filePath), basename + pairExt), path.join(path.dirname(filePath), basename + 'JPG')]
			async.map(filesToCheck, _checkIfAccessible, (err, results) => {
				callback(err, _.some(results))
			})
		}
	})
}

module.exports = {
	removeUnpaired: (dir, mainExt = 'dng', pairExt = 'jpg', recursive = false) => {
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
				let ext = path.extname(file).substr(1)

				if (ext.toLowerCase() == mainExt.toLowerCase()) {
					_checkIfPaired(path.join(dir, file), mainExt, pairExt, (err, isPaired) => {
						console.log(file, isPaired)
						callback(err, isPaired)
					})
				}
			}, (err, results) => {
				console.log('removeUnpaired results', err, results)
			})
		})

		/*let files = ["D:/GDrive/PHOTO/2016/100_0110/IMGP0988.JPG",
"D:/GDrive/PHOTO/2016/100_0110/IMGP0990.JPG",
"D:/GDrive/PHOTO/2016/100_0110/IMGP0991.JPG",
"D:/GDrive/PHOTO/2016/100_0110/IMGP0993.JPG",
"D:/GDrive/PHOTO/2016/100_0110/IMGP0994.JPG",
"D:/GDrive/PHOTO/2016/100_0110/IMGP0995.JPG",
"D:/GDrive/PHOTO/2016/100_0110/IMGP0996.JPG",
"D:/GDrive/PHOTO/2016/100_0110/IMGP0997.JPG",
"D:/GDrive/PHOTO/2016/100_0110/IMGP0998.JPG",
"D:/GDrive/PHOTO/2016/100_0110/IMGP1007.JPG",
'D:/GDrive/PHOTO/2016/100_0110/IMGP1008.JPG',
'D:/GDrive/PHOTO/2016/100_0110/IMGP1010.JPG',
'D:/GDrive/PHOTO/2016/100_0110/IMGP1011.JPG',
'D:/GDrive/PHOTO/2016/100_0110/IMGP1012.JPG',
'D:/GDrive/PHOTO/2016/100_0110/IMGP1017.JPG',
'D:/GDrive/PHOTO/2016/100_0110/IMGP1020.JPG',
'D:/GDrive/PHOTO/2016/100_0110/IMGP1030.JPG',
'D:/GDrive/PHOTO/2016/100_0110/IMGP1034.JPG',
'D:/GDrive/PHOTO/2016/100_0110/IMGP1036.DNG',
'D:/GDrive/PHOTO/2016/100_0110/IMGP1036.JPG',
'D:/GDrive/PHOTO/2016/100_0110/IMGP1042.JPG',
'D:/GDrive/PHOTO/2016/100_0110/IMGP1052.JPG',
'D:/GDrive/PHOTO/2016/100_0110/IMGP1069.JPG',
'D:/GDrive/PHOTO/2016/100_0110/IMGP1086.JPG',
'D:/GDrive/PHOTO/2016/100_0110/IMGP1093.JPG',
'D:/GDrive/PHOTO/2016/100_0110/IMGP1098.JPG',
'D:/GDrive/PHOTO/2016/100_0110/IMGP1111.JPG',
'D:/GDrive/PHOTO/2016/100_0110/IMGP1132.JPG']

files.map((file) => {
	_checkIfPaired(file, mainExt, pairExt, (err, isPaired) => {
					console.log(err, isPaired)
				})
})*/

		return processedFiles
	}
}