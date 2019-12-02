const NodePdfPrinter = require("node-pdf-printer");
const dataEticheta = require('./eticheta')
var setari = require.main.require("./setari");

const fs = require("fs");
// const path = require("path");
const puppeteer = require('puppeteer');
const handlebars = require("handlebars");

async function createPDF(uid, sendToPrinter = false) {
	let dateEticheta = {};
	if (typeof uid == "object") {
		dateEticheta = dataEticheta.getJsonEticheta(
			uid["DEN_SORT"],
			uid["COD_CEPI"],
			uid["GRAMAJ"],
			uid["LATIME"],
			uid["DATA_LST"],
			uid["DIAM_EXTERIOR"],
			uid["DIAM_INTERIOR"],
			uid["LUNGIME"],
			uid["GREUTATE"],
			uid["NR_BOBINA"]
		)
	}
	if (typeof uid == "string") dateEticheta = await dataEticheta.getDateEticheta(uid);

	//	const dateEticheta = await dataEticheta.getDateEticheta(uid);
	const paramsReport = await dataEticheta.getParametriiReport();
	var templateHtml = fs.readFileSync('./api/print/templateEticheta.html', 'utf8');
	var template = handlebars.compile(templateHtml, { noEscape: true });
	var html = template(dateEticheta);

	const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: true });
	let page = await browser.newPage();
	await page.setContent(html);
	
	if (paramsReport.pagerRotate == "DA" && sendToPrinter) {
		await page.evaluate(() => {
			document.body.style.transform = 'rotate(-180deg)';
		});
	}

	//asteapta 500ms 
	await new Promise(resolve => setTimeout(resolve, 500));

	await page.pdf(paramsReport);

	await browser.close();

	if (sendToPrinter) {
		//		const appDir = __dirname.substring(0, __dirname.indexOf("api"));
		const pathPDF = setari.pathToTemp + paramsReport.pdfName;
		//const pathPDF = appDir + "pdf/" + paramsReport.pdfName;
		const array = [pathPDF];
		for (let i = 1; i < paramsReport.numberOfCopies; i++) {
			array.push(pathPDF)
		}
		NodePdfPrinter.printFiles(array, paramsReport.printerName);
	}
	deletePDF(paramsReport.path)
	return paramsReport.path;
}

deletePDF = (path) => {//delete asyncron after 30 sec
	setTimeout(() => {
		fs.unlink(path, (err) => {
			if (err) {
				// console.error(err)
				return
			}
		})
	}, 60000);
}

exports.createPDF = createPDF;
//https://pptr.dev/