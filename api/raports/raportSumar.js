const pool = require('.././databaseConnection');
const excel = require('node-excel-export');
const fs = require('fs');
var moment = require('moment');
var setari = require.main.require("./setari");
var generalMethods = require.main.require("./api/generalMethods");
var styles = require('./style').styles;
var tb = require('../getTableName');

const specification = {
    paper_type: {
        displayName: 'Paper Type Name',
        headerStyle: styles.header,
        cellStyle: styles.cell,
        width: 160
    },
    gramaj: {
        displayName: 'Sustance',
        headerStyle: styles.header,
        cellStyle: styles.cell,
        width: 70
    },
    latime: {
        displayName: 'Width',
        headerStyle: styles.header,
        cellStyle: styles.cell,
        width: 60
    },
    nrPozitii: {
        displayName: 'Total Number',
        headerStyle: styles.header,
        cellStyle: styles.cell,
        width: 120
    },
    greutate: {
        displayName: 'Total Weight',
        headerStyle: styles.header,
        cellStyle: styles.cell,
        width: 120
    }
}
function setRowTotal(result) {
    let sumGreutate = 0;
    let sumPozitii = 0;
    for (elem of result) {
        sumGreutate += elem["greutate"];
        sumPozitii += elem["nrPozitii"];
    }
    return [{
        gramaj: "",
        latime: "",
        greutate: sumGreutate,
        paper_type: "Total Quantity & Weight",
        nrPozitii: sumPozitii
    }]

}


async function genRaport(rapObj = {}) {
    try {
        const tabCantarire = await tb.getTableCantarire();
        const tabPlanificare = await tb.getTablePlanificare();
        const tabCantarire_ant = await tb.getTableCantarireAnt();

        const data_ini = rapObj["DATA_INI"] + " " + rapObj["TIME_INI"];
        const data_fin = rapObj["DATA_FIN"] + " " + rapObj["TIME_FIN"];
        const dataIni = moment(data_ini).format('DD-MM-YYYY HH:mm');
        const dataFin = moment(data_fin).format('DD-MM-YYYY HH:mm');
        const an_ini = moment(data_ini).format('YYYY');
        const an_fin = moment(data_fin).format('YYYY');
        const heading = [
            [{ value: "Summary Report", style: styles.title }],
            [{ value: `Wind Date: From ${dataIni} to ${dataFin}, Wind Shift: All`, style: styles.subtitle }]
        ];
        const merges = [
            { start: { row: 1, column: 1 }, end: { row: 1, column: 5 } },
            { start: { row: 2, column: 1 }, end: { row: 2, column: 5 } },
        ]
        let sql = `
        SELECT gramaj,latime,paper_type,sum(greutate) as greutate, count(*) as nrPozitii from(
            SELECT
            c.gramaj,
            c.latime,
            c.greutate,
            c.den_sort as  paper_type
            FROM ${tabCantarire} c
            where c.DATA BETWEEN '${data_ini}'  and '${data_fin}'
        ) as hh group by gramaj,latime,paper_type
        `;

        if (tabCantarire_ant != "" && an_ini != an_fin) {
            sql = `
            SELECT gramaj,latime,paper_type,sum(greutate) as greutate, count(*) as nrPozitii from(
                SELECT
                c.gramaj,
                c.latime,
                c.greutate,
                c.den_sort as  paper_type
                FROM ${tabCantarire} c
                where c.DATA BETWEEN '${data_ini}'  and '${data_fin}'
                UNION ALL 
                SELECT
                c.gramaj,
                c.latime,
                c.greutate,
                c.den_sort as  paper_type
                FROM ${tabCantarire_ant} c
                where c.DATA BETWEEN '${data_ini}'  and '${data_fin}'
            ) as hh group by gramaj,latime,paper_type           `;
        }

        const result = await pool.query(sql);
        const rowTotal = setRowTotal(result[0]);
        const report = excel.buildExport([{
            name: 'Report productie',
            heading: heading,
            merges: merges,
            specification: specification,
            data: [...result[0], ...rowTotal]
        }]
        );
        const fileXLS = setari.pathToTemp + `RapSumar ${moment(data_ini).format('DD-MM-YYYY HH_mm')} - ${moment(data_fin).format('DD-MM-YYYY HH_mm')}.xlsx`
        return await generalMethods.writeXLSFile(setari.pathRaports, fileXLS, report)
    } catch (err) {
        throw new Error(err)
    }
}

exports.genRaport = genRaport;