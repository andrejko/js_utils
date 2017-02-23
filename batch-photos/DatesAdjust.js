let fs = require("fs")
let path = require("path")
let async = require('async')
let _ = require('lodash')
let ExifImage = require('exif').ExifImage;

class DatesAdjust {
	constructor(dir) {
		this.dir = dir;
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

	_adjustDirectoryName(dir, callback) {
		if (file.indexOf('_') !== -1) {
			let parts = file.split('_');

			if (parts[1].length === 4) {
				let continueJpgSearch = true;
				let fileIndex = 0;

				_checkDirectoryFileExif(dir);
			}
		}
	}

	_checkDirectoryFileExif(dir, callback) {
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

						console.log(filePath + ' -> ' + newPath);
						/*fs.rename(filePath, newPath, (err) => {
						});*/
					}

					callback(null);
				});
			});
		}, (err) => {

		})
	}

	processDir() => {
		fs.readdir(this.dir, (err, files) => {
			files.map((file) => {
				let filePath = path.join(dir, file);

				fs.stat(filePath, (err, stats) => {
					if (stats.isDirectory()) {
						this._adjustDirectoryName(file);
					}
				});
			});
		});
	}
}

module.exports = DatesAdjust;