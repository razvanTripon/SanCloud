var pool = require('../databaseConnection');
var tb=require('../getTableName');

async function getData(codProdus){
	try{
		const tabCantarire=await tb.getTableCantarire();
		const result = await pool.query(`select max(nr_tambur) from ${tabCantarire}`); 
		const maxTambur=result[0][0]["nr_tambur"];
		
		const resultMarja = await pool.query(`SELECT VALUE FROM variabile WHERE section='CANTARIRE' AND NAME='MARJA_DIAMETRU' `);
		let marja=0;
		if(resultMarja[0][0]){
			marja=+resultMarja[0][0]["VALUE"];
		}
		
		return{
			MAXTAMBUR:maxTambur==null ? 1 : maxTambur,
			MARJA:marja
		}
	}catch(err){
		throw new Error(err)
	}
}
exports.getData=getData;