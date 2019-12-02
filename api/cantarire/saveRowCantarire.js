const pool = require('../databaseConnection');
const moment = require('moment');
const tb = require('../getTableName');
const gCSV=require('../genCSV');

async function set(data) {
	const tabCantarire = await tb.getTableCantarire();
	const tabPlanificare = await tb.getTablePlanificare();

	let nrBobina = data["NR_BOBINA"] == 'null' ? "0" : data["NR_BOBINA"];
	if (Number(nrBobina) == 0) {
		nrBobina = await getNrBobina();
	}
	const schimbul = await getTuraActiva();
	const dateTime = moment().format('YYYY-MM-DD HH:mm:ss');
	data["NR_BOBINA"] = nrBobina;
	data["TURA"] = schimbul;
	data["DATA"] = dateTime;

	try {
		let sqlInser = `insert into ${tabCantarire}(UID,TAMBUR,BOBINA,COD_SORT,DEN_SORT,COD_CEPI,GRAMAJ,CLIENT,DEN_CLIENT,NR_TAMBUR,NR_BOBINA,TURA,LATIME,LUNGIME,DIAM_INTERIOR,DIAM_EXTERIOR,DIAM_TRADUCTOR,GREUTATE,DATA,CODOP) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
		if (data["operatie"] == "modify") {
			sqlInser = "update " + tabCantarire + " set UID=?,TAMBUR=?,BOBINA=?,COD_SORT=?,DEN_SORT=?,COD_CEPI=?,GRAMAJ=?,CLIENT=?,DEN_CLIENT=?,NR_TAMBUR=?,NR_BOBINA=?,TURA=?,LATIME=?,LUNGIME=?,DIAM_INTERIOR=?,DIAM_EXTERIOR=?,DIAM_TRADUCTOR=?,GREUTATE=?,DATA=?,CODOP=? where uid='" + data["UID"] + "'";
		}
		const result = await pool.query(sqlInser, [
			data["UID"],
			data["TAMBUR"],
			data["BOBINA"],
			data["COD_SORT"],
			data["DEN_SORT"],
			data["COD_CEPI"],
			data["GRAMAJ"],
			data["CLIENT"],
			data["DEN_CLIENT"],
			data["NR_TAMBUR"],
			nrBobina,
			schimbul,
			data["LATIME"],
			data["LUNGIME"],
			data["DIAM_INTERIOR"],
			data["DIAM_EXTERIOR"],
			data["DIAM_TRADUCTOR"],
			data["GREUTATE"],
			dateTime,
			data["CODOP"]
		]);

		await gCSV.generateCSV(nrBobina,nrBobina)
		return {
			salvare: "ok",
		}
	} catch (err) {
		throw new Error(err)
	}

}

async function getNrBobina() {
	try {
		const tabCantarire = await tb.getTableCantarire();
		const resultBob = await pool.query(`SELECT max(nr_bobina)+1 as NR_BOBINA FROM ${tabCantarire} `);
		return resultBob[0][0]["NR_BOBINA"] == null ? 1 : resultBob[0][0]["NR_BOBINA"]
	} catch (err) {
		throw new Error(err)
	}
}

async function getTuraActiva() {
	try {
		var now = new Date();
		var tura1 = new Date();
		var tura2 = new Date();
		var tura3 = new Date();
		const resultTure = await pool.query(`SELECT * FROM variabile WHERE NAME LIKE 'tura%' AND section='CANTARIRE' `);
		for (let row of resultTure[0]) {
			if (row["NAME"] == "tura1") {
				const hhmm = row["VALUE"].split(":");
				tura1.setHours(Number(hhmm[0]), Number(hhmm[1]))
			}
			if (row["NAME"] == "tura2") {
				const hhmm = row["VALUE"].split(":");
				tura2.setHours(Number(hhmm[0]), Number(hhmm[1]))
			}
			if (row["NAME"] == "tura3") {
				const hhmm = row["VALUE"].split(":");
				tura3.setHours(Number(hhmm[0]), Number(hhmm[1]))
			}
		}
		if (now >= tura1 && now < tura2) return "Schimbul 1"
		if (now >= tura2 && now < tura3) return "Schimbul 2"
		if (now >= tura3 || now < tura1) return "Schimbul 3"

		return "";

	} catch (err) {
		throw new Error(err)
	}
}

exports.set = set;