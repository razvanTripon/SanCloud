var pool = require('../databaseConnection');

async function getData(){
	try{
		const result = await pool.query(`SELECT CODP,DENUMIRE,CPSA FROM nomp where par='SORT' order by codp,denumire`); 
		return 	result[0];
	}catch(err){
		throw new Error(err)
	}
}
exports.getData=getData;