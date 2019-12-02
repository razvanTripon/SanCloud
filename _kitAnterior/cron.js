var cron = require('node-cron');
var setari = require.main.require("./setari");
var methodsBackup = require('./api/backup/methodsBackup');
var rapDetaliat = require('./api/raports/raportDetaliat');
var rapSumar = require('./api/raports/raportSumar');
var moment = require('moment');

const fs = require('fs');
const path = require('path');

//ex cron.schedule('50 17 * * *', () => {}) se executa in fiecare zi la ora 17:50

cron.schedule('00 07 * * *', () => {
	console.log('generate raports !!!!!!!!!!!!');
	const DATA_INI = moment().subtract(1, "days").format("YYYY-MM-DD");
	const DATA_FIN = moment().format("YYYY-MM-DD");
	const TIME_INI="07:00";
	const TIME_FIN="07:00";
	rapDetaliat.genRaport({DATA_INI,DATA_FIN,TIME_INI,TIME_FIN});
	rapSumar.genRaport({DATA_INI,DATA_FIN,TIME_INI,TIME_FIN});
});

cron.schedule('*/300 * * * *', () => {
	console.log('cron DB backup!!!!!!!!!!!!');
	methodsBackup.dumpDB()
		.then((numeArhiva) => {
			console.log('cron backup executat cu succes ' +numeArhiva)
		})
		.catch(err => { console.log(err) });
});

cron.schedule('*/30 * * * *', () => { //'running a task every 30 minutes'
	console.log('################# cron --delete ' + setari.pathToTemp + " fisiere mai vechi de 30 minute");
	emptyFolder(setari.pathToTemp)
});

emptyFolder = (directory) => {//delete asyncron 
	fs.readdir(directory, (err, files) => {
		if (err) throw err;
		for (const file of files) {
			const caleFisier = path.join(directory, file)
			const { birthtimeMs } = fs.statSync(caleFisier)
			const now = Date.now();
			const dif = ((now - birthtimeMs) / 1000) / 60
			if (dif > 30) {
				fs.unlink(path.join(directory, file), err => {
					if (err) throw err;
				});
			}
		}
	});
}



