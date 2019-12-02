var pool = require('../databaseConnection');

async function setData(data,op){
	try{
		let sqlInser='insert into nomp(CODP,TIPMAT,CPSA,DENUMIRE,UM,PAD,MONEDA,PRET,TAXE,CODAUX,OBS,PAR,PRETDEVIZ,PRETRECOM,GRAMAJ,LATIME,DIAM_INTERIOR,DIAM_EXTERIOR,CONT,CONC_ALCOOL,GRAMAJ_BRUT,CODURI,RETETAR,MARCA) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
		if(op=="modify"){
			sqlInser="update nomp set CODP=?,TIPMAT=?,CPSA=?,DENUMIRE=?,UM=?,PAD=?,MONEDA=?,PRET=?,TAXE=?,CODAUX=?,OBS=?,PAR=?,PRETDEVIZ=?,PRETRECOM=?,GRAMAJ=?,LATIME=?,DIAM_INTERIOR=?,DIAM_EXTERIOR=?,CONT=?,CONC_ALCOOL=?,GRAMAJ_BRUT=?,CODURI=?,RETETAR=?,MARCA=? where codp='"+data.CODP_OLD+"'";
		}
		const result = await pool.query(sqlInser,[data.CODP,data.TIPMAT,data.CPSA,data.DENUMIRE,data.UM,data.PAD,data.MONEDA,data.PRET,data.TAXE,data.CODAUX,data.OBS,data.PAR,data.PRETDEVIZ,data.PRETRECOM,data.GRAMAJ,data.LATIME,data.DIAM_INTERIOR,data.DIAM_EXTERIOR,data.CONT,data.CONC_ALCOOL,data.GRAMAJ_BRUT,data.CODURI,data.RETETAR,data.MARCA]); 
		return {codp:data.CODP, denumire:data.DENUMIRE}
	}catch(err){
		throw new Error(err)
	}
}
exports.setData=setData;
