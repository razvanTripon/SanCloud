var cron = require('node-cron');
var setari = require.main.require("./setari");
var methodsBackup = require('./api/backup/methodsBackup');
var rapDetaliat = require('./api/raports/raportDetaliat');
var rapSumar = require('./api/raports/raportSumar');
var moment = require('moment');

const fs = require('fs');
const path = require('path');
var findRemoveSync = require('find-remove');

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

//sterge arhivele mai vechi de 60 zile 
setari.pathToBackup.forEach(elem=>{
	cron.schedule('20 03 * * *', () => {
		const zile=60;
		console.log('delete arhive mai vechi de '+zile+' zile')
		var result = findRemoveSync(elem, {
			files: "*.*",
			age: {seconds: zile*24*60*60}
			});
		console.log(result);
	})
})

cron.schedule('00 03 * * *', () => {
	const zile=15;
	console.log('delete logs mai vechi de '+zile+' zile dirName '+setari.pathToTraductoriEvents+' !!!!!!!!!!!!');
	var result = findRemoveSync(setari.pathToTraductoriEvents, {
		extensions: ['.bak', '.log'],
		ignore:['readsCOMs.log','traductoriEvents.log'],
		age: {seconds: zile*24*60*60}
		})
	console.log(result);
});

cron.schedule('15 03 * * *', () => {
	const zile=15;
	console.log('delete logs mai vechi de '+zile+' zile dirName c:/SanCloud/log !!!!!!!!!!!!');
	var result = findRemoveSync('c:/SanCloud/log/', {
		files: "*.*",
		ignore:'access.log',
		age: {seconds: zile*24*60*60}
		})
	console.log(result);
});

cron.schedule('25 03 * * *', () => {
	const zile=15;
	console.log('delete logs mai vechi de '+zile+' zile dirName c:/SanCloud/log !!!!!!!!!!!!');
	var result = findRemoveSync('c:/SanCloud/daemon/', {
		files: "*.log",
		ignore:['sancloud.err.log','sancloud.out.log','sancloud.wrapper.log'],
		age: {seconds: zile*24*60*60}
		})
	console.log(result);
});


cron.schedule('*/480 * * * *', () => {
	console.log('cron DB backup!!!!!!!!!!!!');
	methodsBackup.dumpDB()
		.then((numeArhiva) => {
			console.log('cron backup executat cu succes ' +numeArhiva)
		})
		.catch(err => { console.log(err) });
});

cron.schedule('*/30 * * * *', () => { 
	const min=30;
	console.log('################# cron --delete ' + setari.pathToTemp + " fisiere mai vechi de "+min+" minute");
	const resultT = findRemoveSync(setari.pathToTemp, {
		files: "*.*",
		age: {seconds: min*60}
		})
	console.log(resultT);
});
