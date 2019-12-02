var pool = require('../databaseConnection');
var tb=require('../getTableName');

async function getData(uid){
	try{
		const tabCantarire=await tb.getTableCantarire();
//		const tabPlanificare=await tb.getTablePlanificare();
		
		const resultBob = await pool.query(`select max(nr_bobina)+1 MAXBOBINA from ${tabCantarire}`); 
		let maxBobina=resultBob[0][0]["MAXBOBINA"] ? resultBob[0][0]["MAXBOBINA"] : 1;
		let res={
				MAXBOBINA:maxBobina,
		}
		return 	res;
	}catch(err){
		throw new Error(err)
	}
}


exports.getData=getData;