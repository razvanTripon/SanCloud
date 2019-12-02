var pool = require('../databaseConnection');
DecimalFormat = require('./DecimalFormat').DecimalFormat;
const path = require("path");
var setari = require.main.require("./setari");
var tb=require('../getTableName');

const STARCHAR = 155;
const STOPCHAR = 156;
const CHKSTART = 105;
const CHKREMDR = 103;
const DG = new DecimalFormat("###0.00");
const DF = new DecimalFormat("###0");

async function getParametriiReport() {
	const milis = new Date().getTime();
	const pdfName = `eticheta-${milis}.pdf`;
	//const pdfPath = path.join('pdf', pdfName);
	const pdfPath = setari.pathToTemp + pdfName;
	const options = {
		displayHeaderFooter: false,
		pdfName: pdfName,
		pdfPath: pdfPath,
		path: pdfPath,
		width: '0in',
		height: '0in',
		margin: { top: "5mm", bottom: "5mm", left: "5mm", right: "5mm" },
		format: "A3",
		landscape: true,
		numberOfCopies: 1,
		printerName: "",
		pagerRotate:false
	}
	try {
		const result = await pool.query(`SELECT NAME,VALUE FROM variabile WHERE section='CANTARIRE' AND NAME LIKE 'P%' `);
		for (let row of result[0]) {
			if (row["NAME"] == "PAPER_HEIGHT") options["height"] = row["VALUE"] + 'in';
			if (row["NAME"] == "PAPER_WIDTH") options["width"] = row["VALUE"] + 'in';
			if (row["NAME"] == "PAPER_MARGIN_TOP") options["margin"]["top"] = row["VALUE"] + 'mm';
			if (row["NAME"] == "PAPER_MARGIN_BOTTOM") options["margin"]["bottom"] = row["VALUE"] + 'mm';
			if (row["NAME"] == "PAPER_MARGIN_RIGHT") options["margin"]["right"] = row["VALUE"] + 'mm';
			if (row["NAME"] == "PAPER_MARGIN_LEFT") options["margin"]["left"] = row["VALUE"] + 'mm';
			if (row["NAME"] == "PAPER_FORMAT") options["format"] = row["VALUE"];
			if (row["NAME"] == "PAPER_ORIENTATION") options["landscape"] = row["VALUE"] == "LANDSCAPE";
			if (row["NAME"] == "PAPER_COPIES") options["numberOfCopies"] = Number(row["VALUE"]);
			if (row["NAME"] == "PRINTER") options["printerName"] = row["VALUE"];
			if (row["NAME"] == "PAGER_ROTATE") options["pagerRotate"] = row["VALUE"];
			
		}
		return options
	} catch (err) {
		throw new Error(err)
	}
}
// function getElemCodificate(
// {gramaj=0,latime=0,greutate=0,codSortiment=""}={}
// ){

// }

function getJsonEticheta(
	SORTIMENT_DENUMIRE = "",
	COD_SORTIMENT = "",
	GRAMAJ = 0,
	LATIME = 0,
	PDATE = "",
	D_EXT = 0,
	D_INT = 0,
	LEN = 0,
	WGHT = 0,
	NRBOBINA = 0) {
	const codProducator = "0946";
	const LATIMEN = Math.round(LATIME * 10);
	const reelCode = zeroFillString(COD_SORTIMENT, 2) + zeroFillInt(GRAMAJ, 3) + zeroFillInt(LATIMEN, 4) + zeroFillInt(WGHT, 4) + zeroFillInt(LEN, 5);
	const nrBobina_ = PDATE.substring(2, 4) + NRBOBINA; // ultimele 2 cifre din an + nrBobina
	const reelIDCode = zeroFillString(nrBobina_, 10) + zeroFillString(codProducator, 4);
	return {
		SORTIMENT: getValue(SORTIMENT_DENUMIRE, ""),
		SUBST: DF.format(GRAMAJ),
		WIDTHN: DF.format(LATIMEN),
		PDATE: PDATE,
		D_EXT: DF.format(D_EXT),
		D_INT: DG.format(D_INT),
		LEN: DF.format(LEN),
		WGHT: DF.format(WGHT),
		REELBARCODE: generateBarCode(reelCode),
		REELCODE: reelCode,
		REELIDBARCODE: generateBarCode(reelIDCode),
		REELIDCODE: reelIDCode,
		REEL: NRBOBINA
	}
}
async function getDateEticheta(uid) {
	const codProducator = "0946";
	const tabCantarire=await tb.getTableCantarire();
	const tabPlanificare=await tb.getTablePlanificare();

	try {
		// const mysql = `select 
		// 	p.den_sort as SORTIMENT,
		// 	p.gramaj as GRAMAJ, 
		// 	c.LATIME,
		// 	DATE_FORMAT(C.DATA,'%Y-%m-%d') as DATA,
		// 	c.DIAM_EXTERIOR,
		// 	c.DIAM_INTERIOR,
		// 	c.LUNGIME,
		// 	c.GREUTATE,
		// 	c.NR_BOBINA,
		// 	p.COD_CEPI as C_SORTIMENT
		// 	from ${tabCantarire} c 
		// 	left outer join ${tabPlanificare} p on c.bobina=p.uid
		// 	where c.uid=? `;
		const mysql = `select 
			c.den_sort as SORTIMENT,
			c.gramaj as GRAMAJ, 
			c.LATIME,
			DATE_FORMAT(C.DATA,'%Y-%m-%d') as DATA,
			c.DIAM_EXTERIOR,
			c.DIAM_INTERIOR,
			c.LUNGIME,
			c.GREUTATE,
			c.NR_BOBINA,
			c.COD_CEPI as C_SORTIMENT
			from ${tabCantarire} c 
			where c.uid=? `;
		const result = await pool.query(mysql, [uid]);
		const res = result[0][0];
		const gramaj = Math.round(res["GRAMAJ"]);
		const latime = res["LATIME"];
		const lungime = Math.round(res["LUNGIME"]);
		const greutate = Math.round(res["GREUTATE"]);
		let codSortiment = getValue(res["C_SORTIMENT"], "");
		const nrBobina = res["NR_BOBINA"];

		return getJsonEticheta(
			res["SORTIMENT"],
			codSortiment,
			gramaj,
			latime,
			res["DATA"],
			res["DIAM_EXTERIOR"],
			res["DIAM_INTERIOR"],
			lungime,
			greutate,
			nrBobina);

		// return {
		// 	SORTIMENT: getValue(res["SORTIMENT"], ""),
		// 	SUBST: DF.format(gramaj),
		// 	WIDTHN: DF.format(latimen),
		// 	PDATE: res["DATA"],
		// 	D_EXT: DF.format(res["DIAM_EXTERIOR"]),
		// 	D_INT: DG.format(res["DIAM_INTERIOR"]),
		// 	LEN: DF.format(lungime),
		// 	WGHT: DF.format(greutate),
		// 	REELBARCODE: generateBarCode(reelCode),
		// 	REELCODE: reelCode,
		// 	REELIDBARCODE: generateBarCode(reelIDCode),
		// 	REELIDCODE: reelIDCode,
		// 	CLIENT: res["NUME_CLIENT"],
		// 	CMD: res["NR_COMANDA"],
		// 	REEL: nrBobina
		// }

	} catch (err) {
		throw new Error(err)
	}
}

generateBarCode = (code) => {
	//	console.log(code)
	let res = "";
	let chkSum = CHKSTART;
	if (code.length % 2 == 1)
		return null;
	let len = code.length / 2;
	unicode = [len];
	let idx = 0;
	for (let i = 0; i < code.length; i = i + 2) {
		idx++;
		const pair = Number(code.substring(i, i + 2)) //new Byte(code.substring(i, i + 2)).byteValue();
		unicode[idx - 1] = computeChar(pair);
		chkSum += pair * idx;
	}
	chkSum = chkSum % CHKREMDR;
	res = decimalPoint(STARCHAR);
	for (let i = 0; i < unicode.length; i++) {
		res += decimalPoint(unicode[i]);
	}
	res += decimalPoint(computeChar(chkSum));
	res += decimalPoint(STOPCHAR);
	return res;
}

decimalPoint = (v) => {
	if (v == 128) v = 8364;
	return "&#" + v + ";";
}

computeChar = (v) => {
	let ret = 128;
	if (v == 0)
		ret = 128;
	else {
		if (v >= 1 && v <= 94)
			ret = v + 32;
		else
			ret = v + 50;
	}
	return ret;
}

zeroFillString = (strI, count) => {
	let str = strI.toString();
	while (str.length < count)
		str = "0" + str;
	return str;
}

zeroFillInt = (nr, zeroes) => {
	let ptrn = "";
	for (let i = 0; i < zeroes; i++)
		ptrn += "0";
	return new DecimalFormat(ptrn).format(nr);
}
getValue = (value, defVal) => {
	return value == null ? defVal : value;
}


module.exports.getDateEticheta = getDateEticheta;
module.exports.getParametriiReport = getParametriiReport;
module.exports.getJsonEticheta = getJsonEticheta;




