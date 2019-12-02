var pool = require('../databaseConnection');

async function getAllRows(){
	try{
		const result = await pool.query(`SELECT * FROM firma order by FACCES desc`); 
		return 	result[0];
	}catch(err){
		throw new Error(err)
	}
}
async function getRow(codu){
	try{
		const result = await pool.query(`SELECT CODU,GRUP,NUME,PASS,PASS as PASSCONFIRM,FACCES,CFG,DREPT,TEL,EMAIL,CNP,CFGBI,NUME_PRENUME,CFD FROM firma where CODU=?`,[codu]); 
		return 	result[0][0];
	}catch(err){
		throw new Error(err)
	}
}

async function deleteRow(codu){
	try{
		const result = await pool.query("delete from firma where codu=?",[codu]); 
		return {deleted:true}
	}catch(err){
		throw new Error(err)
	}
}

async function saveRow(data,op){
	try{
		console.log(data)
		let sqlInser='insert into firma(CODU,GRUP,NUME,PASS,FACCES,CFG,DREPT,TEL,EMAIL,CNP,CFGBI,NUME_PRENUME,CFD) values (?,?,?,?,?,?,?,?,?,?,?,?,?)';
		if(op=="modify"){
			sqlInser="update firma set CODU=?,GRUP=?,NUME=?,PASS=?,FACCES=?,CFG=?,DREPT=?,TEL=?,EMAIL=?,CNP=?,CFGBI=?,NUME_PRENUME=?,CFD=? where codu='"+data.CODU+"'";
		}
		const result = await pool.query(sqlInser,[data.CODU,data.GRUP,data.EMAIL,data.PASS,data.FACCES,data.CFG,data.DREPT,data.TEL,data.EMAIL,data.CNP,data.CFGBI,data.NUME_PRENUME,data.CFD]); 
		return {codu:data.CODU, nume:data.NUME}
	}catch(err){
		throw new Error(err)
	}
}
exports.getAllRows=getAllRows;
exports.getRow=getRow;
exports.deleteRow=deleteRow;
exports.saveRow=saveRow;