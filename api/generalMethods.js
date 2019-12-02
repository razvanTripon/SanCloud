var fs = require('fs');
var path=require('path');

function deleteFile(path) {
	fs.unlink(path, (err) => {
		if (err) {
			//console.log(err)
			return
		}
	})
}

function fileMultiplicate(foldersArray = [], fileName, fileCreated) {
	foldersArray.forEach(path => {
		if (!fs.existsSync(path)) {
			fs.mkdirSync(path);
		}
		deleteFile(path + fileName);
		fs.copyFile(fileCreated, path + fileName, (err) => {
			if (err) throw err;
		});
	})
}

function writeXLSFile(foldersArray, filePath, databuffer) {
	deleteFile(filePath)
	return new Promise((resolve, reject) => {
		fs.writeFile(filePath, databuffer, function (err) {
			if (err) {
				reject(err);
			}
			fileMultiplicate(foldersArray,path.basename(filePath),filePath)
			resolve(filePath)
		});
	})
}

exports.deleteFile = deleteFile;
exports.fileMultiplicate = fileMultiplicate;
exports.writeXLSFile = writeXLSFile;
