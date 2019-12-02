var pool = require('../databaseConnection');

async function getData(){
	try{
		const result = await pool.query(`SELECT * FROM nomf order by nume`); 
		return 	result[0];
	}catch(err){
		throw new Error(err)
	}
}
exports.getData=getData;