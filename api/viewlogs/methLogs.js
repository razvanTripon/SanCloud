var fs = require('fs');
const fse = require('fs-extra');

var path = require('path')
var setari = require.main.require("./setari");

const dirAccesLog = "c:/SanCloud/log/";
const daemonLogs = "c:/SanCloud/daemon/";
const pathTOViewLog="c:/SanCloud/public/logs/"
async function getLogs() {
	const dirTraductori = setari.pathToTraductoriEvents;
	emptyViewLogs();

	return {
		traductoriEvents: await getFiles(dirTraductori),
		accessLog: await getFiles(dirAccesLog),
		daemon: await getFiles(daemonLogs)
	}
}

async function getFiles(dir) {
	try {
		var files = fs.readdirSync(dir);
		files = files.filter((elem) => {
			var extName = path.extname(elem);
			return extName === '.log';
		})

		files.sort(function (a, b) {
			return fs.statSync(dir + b).mtime.getTime() -
				fs.statSync(dir + a).mtime.getTime();
		});
		await copyFiles(dir,pathTOViewLog)
		return files;
	} catch (err) {
		throw new Error(err)
	}
}

async function copyFiles(source, dest) {
    try {
        await fse.copy(source, dest)
        return true;
    } catch (err) {
        return false;
    }
}

async function emptyViewLogs() {
    try {
        await fse.emptyDir(pathTOViewLog)
        return true
    } catch (err) {
        throw new Error(err)
    }
}

exports.getLogs = getLogs;
exports.emptyViewLogs = emptyViewLogs;
