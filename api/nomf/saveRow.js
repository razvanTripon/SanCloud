var pool = require('../databaseConnection');

async function setData(data,op){
	try{
		let sqlInser='insert into nomf(COD,NUME,CODAUX,LOCALITATE,JUDET,OBS,STR,POSTAL,TEL,FAX,PAR,CAEN,STCEG,BRSCG,VKBUR,VKGRP,KDGRP,KTGRD,NR,BLOC,SCARA,ETAJ,AP,SECTOR,UACCES,FOTOGRAFIE,TARA,TIP,ORC,CAPITAL_SOCIAL,CF_PARINTE,EMAIL,BI,POLITIA,NIR,CETATENIE,TIP_CI,TIP_AUTORIZ,DATA_IAU,DATA_SFA,OBS_FACT,CALITATE,WEB) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
		if(op=="modify"){
			sqlInser="update nomf set COD=?,NUME=?,CODAUX=?,LOCALITATE=?,JUDET=?,OBS=?,STR=?,POSTAL=?,TEL=?,FAX=?,PAR=?,CAEN=?,STCEG=?,BRSCG=?,VKBUR=?,VKGRP=?,KDGRP=?,KTGRD=?,NR=?,BLOC=?,SCARA=?,ETAJ=?,AP=?,SECTOR=?,UACCES=?,FOTOGRAFIE=?,TARA=?,TIP=?,ORC=?,CAPITAL_SOCIAL=?,CF_PARINTE=?,EMAIL=?,BI=?,POLITIA=?,NIR=?,CETATENIE=?,TIP_CI=?,TIP_AUTORIZ=?,DATA_IAU=?,DATA_SFA=?,OBS_FACT=?,CALITATE=?,WEB=? where cod='"+data.COD_OLD+"'";
		}
		const result = await pool.query(sqlInser,[data.COD,data.NUME,data.CODAUX,data.LOCALITATE,data.JUDET,data.OBS,data.STR,data.POSTAL,data.TEL,data.FAX,data.PAR,data.CAEN,data.STCEG,data.BRSCG,data.VKBUR,data.VKGRP,data.KDGRP,data.KTGRD,data.NR,data.BLOC,data.SCARA,data.ETAJ,data.AP,data.SECTOR,data.UACCES,data.FOTOGRAFIE,data.TARA,data.TIP,data.ORC,data.CAPITAL_SOCIAL,data.CF_PARINTE,data.EMAIL,data.BI,data.POLITIA,data.NIR,data.CETATENIE,data.TIP_CI,data.TIP_AUTORIZ,data.DATA_IAU,data.DATA_SFA,data.OBS_FACT,data.CALITATE,data.WEB]); 
		return {cod:data.COD, nume:data.NUME}
	}catch(err){
		throw new Error(err)
	}
}
exports.setData=setData;
