var pool = require('../databaseConnection');

async function get(cod_p){
	try{
		const result = await pool.query(
		`SELECT 
			SUBSTRING_INDEX(SUBSTRING_INDEX(nomp.denumire,' ', 2),' ', -1) AS SORTIMENT,
			nomp.GRAMAJ,
			nomp.LATIME,
			nomp.DIAM_INTERIOR,
			nomp.DIAM_EXTERIOR,
			if(nomp.CPSA is null or LENGTH(nomp.CPSA)=0,nompp.CPSA,nomp.CPSA) CPSA
		FROM nomp 
		left outer join nomp nompp on (nompp.codp = nomp.par) 
		WHERE nomp.codp=? `,[cod_p]); 
		return result[0][0]
	}catch(err){
		throw new Error(err)
	}
}
exports.get=get;