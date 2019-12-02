var pool = require('../databaseConnection');
var tb=require('../getTableName');

async function getData(search) {
	try {
		const tabCantarire=await tb.getTableCantarire();
		
		let sqlText = `SELECT 
							DATE_FORMAT(c.DATA,'%Y-%m-%d') as DATA_LST,
							CONVERT(NR_BOBINA,UNSIGNED INTEGER) AS NR_BOBINA,
							DEN_SORT,
							COD_CEPI,
							GRAMAJ,
							DIAM_INTERIOR,
							DIAM_EXTERIOR,
							LATIME,
							LUNGIME,
							GREUTATE
						FROM ${tabCantarire} c
						WHERE nr_bobina LIKE ?
						ORDER BY nr_bobina ASC	
					`
		let result = await pool.query(sqlText, [search + '%'])
		if(result[0] && result[0].length==0){
			const tabCantarire_ant=await tb.getTableCantarireAnt();
			
			if(tabCantarire_ant.startsWith("cantarire")){
				sqlText=sqlText.replace(tabCantarire,tabCantarire_ant);
				result = await pool.query(sqlText, [search + '%'])
			}
		}
		return result[0];
	} catch (err) {
		throw new Error(err);
	}
}
exports.getData = getData;


