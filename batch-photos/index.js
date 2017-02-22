let fs = require("fs")
let path = require("path")
let async = require('async')
let _ = require('lodash')
let ExifImage = require('exif').ExifImage;

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

_readExifDate = (path, callback) => {
	new ExifImage({
		image: path
	}, (error, exifData) => {
	    if (error) {
	    	callback(error);
	    } else {
	    	let dateTimeParts = exifData.exif.CreateDate.split(' ');
	    	let dateParts = dateTimeParts[0].split(':');

	    	callback(null, [_.padStart(dateParts[1], 2, 0), _.padStart(dateParts[2], 2, 0)]);
	    }
	});
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
	},
	adjustDates: (dir) => {
		fs.readdir(dir, (err, files) => {
			files.map((file) => {
				let filePath = path.join(dir, file);

				fs.stat(filePath, (err, stats) => {
					if (stats.isDirectory()) {
						if (file.indexOf('_') !== -1) {
							let parts = file.split('_');

							if (parts[1].length === 4) {
								let dateParts = parts[1].match(/.{1,2}/g);
								let continueJpgSearch = true;
								let fileIndex = 0;

								async.whilst(() => {
									return continueJpgSearch;
								}, (callback) => {
									console.log('check ', filePath, fileIndex);

									fs.readdir(filePath, (err, files) => {
										let imgFile;

										if (typeof files[fileIndex] !== 'undefined') {
											imgFile = path.join(filePath, files[fileIndex]);
										} else {
											continueJpgSearch = false;
											console.log('No JPG in directory ' + filePath);
										}

										_readExifDate(imgFile, (err, date) => {
											if (err) {
												console.log(filePath, 'Error: ' + err);

												fileIndex++;
											} else {
												continueJpgSearch = false;
												
												let newPath = path.join(dir, date.join('.'));

												fs.rename(filePath, newPath, (err) => {
													console.log(filePath + ' -> ' + newPath);
												});
											}

											callback(null);
										});
									});
								}, (err) => {

								})
							}
						}
					}
				});
			});
		});
	}
}