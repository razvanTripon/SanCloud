var pool = require('../databaseConnection');
var tb=require('../getTableName');

async function set(uid){
	try{
		const tabCantarire=await tb.getTableCantarire();
		const result = await pool.query(`delete from ${tabCantarire} where uid=?`,[uid]); 
		return 	{delete:"ok"};
	}catch(err){
		throw new Error(err)
	}
}
exports.set=set;