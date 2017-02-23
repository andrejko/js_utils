const fs = require("fs");
const path = require("path");
const async = require('async');
const _ = require('lodash');

class RemoveUnpaired {
	constructor(dir, mainExt, pairExt, recursive = false) {
		this.dir = dir;
		this.mainExt = mainExt;
		this.pairExt = pairExt;
		this.recursive = recursive;
	}

	_checkIfAccessible(filePath, callback) {
		fs.access(filePath, fs.f_OK | fs.W_OK, (err) => {
			callback(null, !err);
		})
	}

	_checkIfPaired(filePath, pairExt, callback) {
		let ext = path.extname(filePath).substr(1);
		let basename = path.basename(filePath, ext);
		let filesToCheck = [
			path.join(path.dirname(filePath), basename + this.pairExt),
			path.join(path.dirname(filePath), basename + 'JPG')
		];

		async.some(filesToCheck, this._checkIfAccessible, (err, result) => {
			callback(err, result);
		});
	}

	processDir() {
		fs.readdir(this.dir, (err, files) => {
			if (err) {
				return console.log(err);
			}

			files = files.filter((fileName) => {
				return (path.extname(fileName).substr(1).toLowerCase() == this.mainExt.toLowerCase());
			})

			async.map(files, (file, callback) => {
				let filePath = path.join(this.dir, file);

				this._checkIfPaired(filePath, this.pairExt, (err, isPaired) => {
					if (!isPaired) {
						fs.unlink(filePath, (err) => {
							console.log(filePath + ' removed');
						})
					}

					callback(null);
				})
			})
		})
	}
}

module.exports = RemoveUnpaired;