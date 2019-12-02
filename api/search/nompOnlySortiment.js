var pool = require('../databaseConnection');

async function getData(search) {
	try {
		const sqlText = `SELECT 
					CODP,
					DENUMIRE,
					CPSA
					from nomp
					where (codp like ? or denumire like ?) and par='SORT'
					ORDER BY LENGTH(codp) ASC,codp ASC 
					`
		const result = await pool.query(sqlText, [search + '%', '%' + search + '%'])
		return result[0];
	} catch (err) {
		throw new Error(err);
	}
}
exports.getData = getData;