var pool = require('../databaseConnection');

async function deleteRowNomf(cod){
	try{
		const result = await pool.query("delete from nomf where cod=?",[cod]); 
		return {deleted:true}
	}catch(err){
		throw new Error(err)
	}
}
exports.deleteRowNomf=deleteRowNomf;
