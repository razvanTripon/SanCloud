var pool = require('../databaseConnection');

async function getData(search,client) {
	try {
		const sqlText = `SELECT 
					cod as value,
					concat(cod,' - ', nume) as label
					from noml
					where PARTENER=? and (COD like ? or NUME like ? )
					ORDER BY CAST(data_lan AS DATE) DESC,CAST(DATA_INCH AS DATE) DESC
					limit 10`

		const result = await pool.query(sqlText, [client, search + '%', '%' + search + '%'])
		return result[0];
	} catch (err) {
		throw new Error(err);
	}
}
exports.getData = getData;