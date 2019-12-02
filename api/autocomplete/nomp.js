var pool = require('../databaseConnection');

async function getData(search) {
	try {
		const sqlText = `SELECT 
					codp as value,
					concat(codp,' - ', denumire) as label
					from nomp
					where codp like ? or denumire like ? 
					ORDER BY LENGTH(codp) ASC,codp ASC 
					limit 10`

		const result = await pool.query(sqlText, [search + '%', '%' + search + '%'])
		return result[0];
	} catch (err) {
		throw new Error(err);
	}
}
exports.getData = getData;