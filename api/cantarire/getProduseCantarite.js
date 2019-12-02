var pool = require('../databaseConnection');
var tb=require('../getTableName');

async function getData(uidBobina){
	try{
		//await tb.initTables();
		const tabCantarire=await tb.getTableCantarire();
		const result = await pool.query(`select c.*	from ${tabCantarire} as c where bobina=? order by nr_bobina`,[uidBobina]); 
		let res=result[0];
		return 	res;
	}catch(err){
		throw new Error(err)
	}
}
exports.getData=getData;