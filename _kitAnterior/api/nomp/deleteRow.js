var pool = require('../databaseConnection');

async function deleteRowNomp(cod){
	try{
		const result = await pool.query("delete from nomp where codp=?",[cod]); 
		return {deleted:true}
	}catch(err){
		throw new Error(err)
	}
}
exports.deleteRowNomp=deleteRowNomp;
