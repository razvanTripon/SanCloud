var pool = require('../databaseConnection');

async function getData(search) {
	try {
		const sqlText = `SELECT 
					cod as value,
					concat(cod,' - ', nume) as label
					from nomf
					where cod like ? or nume like ? 
					ORDER BY LENGTH(cod) ASC,cod ASC 
					limit 10`

		const result = await pool.query(sqlText, [search + '%', '%' + search + '%'])
		return result[0];
	} catch (err) {
		throw new Error(err);
	}
}
exports.getData = getData;