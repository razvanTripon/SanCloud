const pool = require('./databaseConnection');
const fse = require('fs-extra');
const setari = require.main.require("./setari");
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const tb = require('./getTableName');
const moment = require('moment');

async function pathExists(f) {
    try {
        await fse.pathExists(f);
        return true;
    } catch (err) {
        console.log(err)
        return false;
    }
}

async function emptyDir(src) {
    try {
        await fse.emptyDir(src)
        return true
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

async function generateCSV(nrBobina1, nrBobina2,salvareVMS="DA") {
    try {
        const pathTMPBobine = setari["bobina_CSV"]["pathTMP"];
        const tabCantarire = await tb.getTableCantarire();
        //const tabPlanificare = await tb.getTablePlanificare();
        const header = ['data', 'cod_sort', 'den_sort', 'client', 'den_client', 'nr_tambur', 'nr_bobina', 'latime', 'lungime', 'diam_interior', 'diam_exterior', 'greutate', 'gramaj', 'cod_CEPI', 'tura']

        const resultBob = await pool.query(
            `select DATE_FORMAT(DATA,'%y') AN , c.* from ${tabCantarire} c where NR_BOBINA between ${nrBobina1} and ${nrBobina2}`);

        for (elem of resultBob[0]) {
            const nrbobina = elem["NR_BOBINA"];
            let numeFile = "bobina_" + elem["AN"] + nrbobina + ".csv";
            let finalPath = pathTMPBobine + numeFile;
            let cQuery = "SELECT "
                + " date_format(c.DATA,'%Y-%m-%d %H:%i:%S') as DATA,"
                + " c.COD_SORT,"
                + " c.DEN_SORT,"
                + " c.CLIENT,"
                + " c.DEN_CLIENT,"
                + " c.NR_TAMBUR,"
                + " c.NR_BOBINA,"
                + " c.TURA,"
                + " c.LATIME,"
                + " c.LUNGIME,"
                + " c.DIAM_INTERIOR,"
                + " c.DIAM_EXTERIOR,"
                + " c.GREUTATE,"
                + " c.COD_CEPI,"
                + " c.GRAMAJ"
                + " FROM " + tabCantarire + " c "
               // + " LEFT OUTER JOIN " + tabPlanificare + " p ON p.uid=c.bobina "
                + " WHERE  c.nr_bobina='" + nrbobina + "' ";
            const result = await pool.query(cQuery).catch((err) => { throw new Error(err) })
            const rs = result[0][0];
            const csvWriter = createCsvWriter({ path: finalPath, header: header });



            const data = [{
                data: rs["DATA"],
                cod_sort: rs["COD_SORT"],
                den_sort: rs["DEN_SORT"],
                client: rs["CLIENT"],
                den_client: rs["DEN_CLIENT"],
                nr_tambur: rs["NR_TAMBUR"],
                nr_bobina: rs["NR_BOBINA"],
                latime: rs["LATIME"] ,
                lungime: rs["LUNGIME"],
                diam_interior: rs["DIAM_INTERIOR"],
                diam_exterior: rs["DIAM_EXTERIOR"],
                greutate: rs["GREUTATE"],
                gramaj: rs["GRAMAJ"],
                cod_CEPI: rs["COD_CEPI"],
                tura: rs["TURA"]
            }];
			if(rs["LUNGIME"]!=0 && rs["GREUTATE"]!=0)	await csvWriter.writeRecords(data)
        }
        //copy to localSave
        await copyFiles(pathTMPBobine, path.join(setari["bobina_CSV"]["localSave"], moment().format('YYYY'), moment().format('MM')))

		if(salvareVMS=="DA"){
			const verifyPathWMS = await pathExists(setari["bobina_CSV"]["path_WMS"]);
			if (verifyPathWMS) {
				const copyToWMS = await copyFiles(pathTMPBobine, setari["bobina_CSV"]["path_WMS"])
				if (copyToWMS) {
					emptyDir(pathTMPBobine)
				}
			}
		}else{
			emptyDir(pathTMPBobine)
		}

        return true

    } catch (err) {
        throw new Error(err)
    }
}
exports.generateCSV = generateCSV;
