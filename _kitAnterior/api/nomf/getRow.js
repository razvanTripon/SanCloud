var pool = require('../databaseConnection');

async function getData(cod){
	try{
		const result = await pool.query(`SELECT * FROM nomf where cod=?`,[cod]); 
		return 	result[0][0];
	}catch(err){
		throw new Error(err)
	}
}
exports.getData=getData;