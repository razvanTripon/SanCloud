var methodsBackup = require('./methodsBackup');

async function execBackup(){
	try{
		console.log('DB backup executat la comanta !!!');
		const result = await methodsBackup.dumpDB();
		console.log('DB backup executat cu succes');
		return 	{backupSuccess:true,file:result};
	}catch(err){
		throw new Error(err)
	}
}
exports.execBackup=execBackup;