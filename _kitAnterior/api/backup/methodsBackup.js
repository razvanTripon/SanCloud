var moment = require('moment');
var setari = require.main.require("./setari");
var mysqldump = require('mysqldump');
var request = require('request');
var encryptor = require('file-encryptor');
var fs = require('fs');

async function dumpDB() {
	const mmn = moment().format('YYYY_MM_DD HH_mm_ss.SSS');
	const fileName = `s1124988_${mmn}.gz`;
	const fileDump = `${setari.pathToTemp}/${fileName}`;
	const fileEncripted = `${setari.pathToTemp}/${fileName}.encr`;
	deleteFile(fileDump);
	deleteFile(fileEncripted);

	await mysqldump({
		connection: setari.mysqlConfig,
		dumpToFile: fileDump,
		compressFile: true,
		dump: {
			schema: {
				table: {
					dropIfExist: true
				}
			}
		}
	}).then(() => {
		saveToFolders(fileName,fileDump);
		encrypt(fileDump,fileEncripted)
	})
	return fileName
}

function deleteFile(path) {
	fs.unlink(path, (err) => {
		if (err) {
			//console.log(err)
			return
		}
	})
}
function saveToFolders(fileName,fileDump) {
	setari.pathToBackup.forEach(path => {
		if (!fs.existsSync(path)) {
			fs.mkdirSync(path);
		}
		deleteFile(path + fileName);
		fs.copyFile(fileDump, path + fileName, (err) => {
			if (err) throw err;
		});
	})
}

function encrypt(fileDump,fileEncripted) {
	var key = 'My Super Secret Key';
	encryptor.encryptFile(fileDump, fileEncripted, key, function (err) {
		sendToCloud(fileEncripted);
	});
	// encryptor.decryptFile('./backups/encrypted.gz', './backups/bun.gz', key, function(err) {
	// 	// Decryption complete.
	//   });
}

function sendToCloud(fileEncripted) {
	var formData = {
		my_file: fs.createReadStream(fileEncripted),
	}
	request.post({ url: setari.urlsyncCloud, formData: formData, gzip: true },
		function optionalCallback(err, response, body) {
			if (err) {
				return console.error('upload failed:', err);
			}
			console.log("DB Syncronizare cloud reusita")
		})
}
exports.dumpDB = dumpDB;
