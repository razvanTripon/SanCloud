var pool = require('./databaseConnection');

async function checkUser(username,password) {
	try{
		const result = await pool.query('SELECT * FROM firma where nume=? and pass=?', [username,password]); 
		if (result[0].length != 1) {
			throw new Error('Numele de utilizator sau parola incorecta');
		}
		return {auth:true, FACCES:result[0][0]["FACCES"]};
	}catch(err){
		throw new Error(err)
	}
}
exports.checkUser=checkUser;