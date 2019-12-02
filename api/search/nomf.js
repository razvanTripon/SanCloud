var pool = require('../databaseConnection');

async function getData(search) {
	try {
		const sqlText = `SELECT COD,NUME,STR,NR,BLOC,SCARA,ETAJ,AP,LOCALITATE,JUDET,TARA
					from nomf
					where COD like ? or NUME like ? 
					ORDER BY LENGTH(COD) ASC,NUME ASC 
					`
		const result = await pool.query(sqlText, [search + '%', '%' + search + '%'])
		return result[0];
	} catch (err) {
		throw new Error(err);
	}
}
exports.getData = getData;