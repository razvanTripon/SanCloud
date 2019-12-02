var pool = require('../databaseConnection');

async function getData(codp){
	try{
		const result = await pool.query(`SELECT * FROM nomp where codp=?`,[codp]); 
		return 	result[0][0];
	}catch(err){
		throw new Error(err)
	}
}
exports.getData=getData;