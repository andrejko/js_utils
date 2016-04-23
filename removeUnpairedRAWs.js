var fs = require("fs");
var path = require("path");

var dir = process.argv[2];
var ext_to_remove = process.argv[3];

if (typeof dir === 'undefined') {
	console.log('Param [1] should be existing directory');
	process.exit();
}

if (typeof ext_to_remove === 'undefined') {
	console.log('Param [2] should be extension to remove');
	process.exit();
}

fs.readdir(dir, function(err, files) {
	if (err) {
		return console.log(err);
	}

	files.forEach(function(file) {
		var file_path = path.join(dir, file);

		fs.stat(file_path, function(err, stats) {
			if (stats.isFile()) {
				var ext = path.extname(file_path).substr(1);
				var basename = path.basename(file, ext);

				if (ext == ext_to_remove) {
					fs.access(path.join(dir, basename + 'JPG'), fs.f_OK, function(err) {
						if (err !== null) {
							fs.unlink(file_path, function(e) {
							if (e === null) {
								console.log(file_path + ' --- removed');
							} else {
								console.log(e);
							}
						});
						}
					});
				}
			}
		});
	});
});