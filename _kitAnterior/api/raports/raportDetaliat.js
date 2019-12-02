const pool = require('.././databaseConnection');
const excel = require('node-excel-export');
const fs = require('fs');
var moment = require('moment');
var setari = require.main.require("./setari");
var generalMethods = require.main.require("./api/generalMethods");
var styles = require('./style').styles;
var tb=require('../getTableName');


const specification = {
    nr_bobina: {
        displayName: 'Reel Nr.',
        headerStyle: styles.header,
        cellStyle: styles.cell,
        width: 80
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
    diam_exterior: {
        displayName: 'Diameter',
        headerStyle: styles.header,
        cellStyle: styles.cell,
        width: 85
    },
    greutate: {
        displayName: 'Weight',
        headerStyle: styles.header,
        cellStyle: styles.cell,
        width: 60
    },
    paper_type: {
        displayName: 'Paper Type',
        headerStyle: styles.header,
        cellStyle: styles.cell,
        width: 110
    },
    dataOperarii: {
        displayName: 'Wind Date',
        headerStyle: styles.header,
        cellStyle: styles.cell,
        width: 100
    }
}
function setRowTotal(result){
    let sumGreutate = 0;
    for (elem of result) {
        sumGreutate += elem["greutate"]
    }
    return [{
        nr_bobina: 'Total Quantity',
        gramaj: result.length,
        latime: "",
        diam_exterior: "Total Weight",
        greutate: sumGreutate,
        paper_type: "",
        dataOperarii: ""
    }]
     
}


async function genRaport(rapObj = {}) {
    try {
		const tabCantarire=await tb.getTableCantarire();
		const tabPlanificare=await tb.getTablePlanificare();

        const data_ini = rapObj["DATA_INI"] + " " + rapObj["TIME_INI"];
        const data_fin = rapObj["DATA_FIN"] + " " + rapObj["TIME_FIN"];
        const dataIni = moment(data_ini).format('DD-MM-YYYY HH:mm');
        const dataFin = moment(data_fin).format('DD-MM-YYYY HH:mm');

        const heading = [
            [{ value: "Detail of produce", style: styles.title }],
            [{ value: `Wind Date: From ${dataIni} to ${dataFin}, Wind Shift: All`, style: styles.subtitle }]
        ];
        const merges = [
            { start: { row: 1, column: 1 }, end: { row: 1, column: 7 } },
            { start: { row: 2, column: 1 }, end: { row: 2, column: 7 } },
        ]

        const result = await pool.query(`
            SELECT
            nr_bobina,
            gramaj,
            latime,
            diam_exterior,
            greutate,
            den_sort AS  paper_type,
            DATE_FORMAT(DATA,'%d/%m/%y %H:%i') as dataOperarii,
            DATA as dataorder  
            FROM ${tabCantarire} c
            where DATA BETWEEN ?  and ? order by dataorder asc `, [data_ini, data_fin]);

        const rowTotal=setRowTotal(result[0]);
        const report = excel.buildExport([{
            name: 'Report productie',
            heading: heading,
            merges: merges,
            specification: specification,
            data: [...result[0],...rowTotal]
        }]
        );
       const fileXLS = setari.pathToTemp + `RapDetalii ${moment(data_ini).format('DD-MM-YYYY HH_mm')} - ${moment(data_fin).format('DD-MM-YYYY HH_mm')}.xlsx`
       return await generalMethods.writeXLSFile(setari.pathRaports,fileXLS,report)
    } catch (err) {
        throw new Error(err)
    }
}

exports.genRaport = genRaport;