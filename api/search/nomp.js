var pool = require('../databaseConnection');

async function getData(search) {
	try {
		const sqlText = `SELECT 
					CODP,
					DENUMIRE,
					TIPMAT,
					PAR,
					UM,
					GRAMAJ,
					LATIME,
					DIAM_INTERIOR,
					DIAM_EXTERIOR
					from nomp
					where codp like ? or denumire like ? 
					ORDER BY LENGTH(codp) ASC,codp ASC 
					`
		const result = await pool.query(sqlText, [search + '%', '%' + search + '%'])
		return result[0];
	} catch (err) {
		throw new Error(err);
	}
}
exports.getData = getData;