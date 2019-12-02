var pool = require('../databaseConnection');
var tb=require('../getTableName');

async function getData(uid){
	try{
		const resultM = await pool.query(`SELECT VALUE FROM variabile WHERE section='CANTARIRE' AND NAME='MARJA_DIAMETRU' `);
		let marja=0;
		if(resultM[0][0]){
			marja=+resultM[0][0]["VALUE"];
		}
		
		const tabCantarire=await tb.getTableCantarire();
		
		const result = await pool.query(`select * from ${tabCantarire} c where uid=? `,[uid]); 
		return 	result[0][0];
	}catch(err){
		throw new Error(err)
	}
}
exports.getData=getData;