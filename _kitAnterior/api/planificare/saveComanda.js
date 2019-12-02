var pool = require('../databaseConnection');
var moment = require('moment');
var tb=require('../getTableName');


function getNumVal(elem){
	return elem=="" || elem==null || elem=="null" ? 0 :elem;
}

function getStrVal(elem,latime){
	if(latime==0) return ""
	return elem=="" || elem==null || elem=="null" ? "" :elem;
}

async function set(data){
	const op=data["operatie"];
	try{
		await tb.initTables();
		
		const tabPlanificare=await tb.getTablePlanificare();

		const resultCEPI = await pool.query('select CPSA,DENUMIRE from nomp where codp=?',[data.COD_SORT]); 
		
		const dataNow=moment().format('YYYY-MM-DD HH:mm:ss');
		const cod_CEPI=resultCEPI[0][0]["CPSA"];
		const denumire=resultCEPI[0][0]["DENUMIRE"];
		
		const REELWIDTH_1=getNumVal(data["REELWIDTH_1"]);
		const REELSUBST_1=getNumVal(data["REELSUBST_1"]);
		const REELCLIENT_1=getStrVal(data["REELCLIENT_1"],REELWIDTH_1);
		let REELDEN_1=getStrVal(data["REELDEN_1"],REELWIDTH_1);

		const REELWIDTH_2=getNumVal(data["REELWIDTH_2"]);
		const REELSUBST_2=getNumVal(data["REELSUBST_2"]);
		const REELCLIENT_2=getStrVal(data["REELCLIENT_2"],REELWIDTH_2);
		let REELDEN_2=getStrVal(data["REELDEN_2"],REELWIDTH_2);

		const REELWIDTH_3=getNumVal(data["REELWIDTH_3"]);
		const REELSUBST_3=getNumVal(data["REELSUBST_3"]);
		const REELCLIENT_3=getStrVal(data["REELCLIENT_3"],REELWIDTH_3);
		let REELDEN_3=getStrVal(data["REELDEN_3"],REELWIDTH_3);

		const REELWIDTH_4=getNumVal(data["REELWIDTH_4"]);
		const REELSUBST_4=getNumVal(data["REELSUBST_4"]);
		const REELCLIENT_4=getStrVal(data["REELCLIENT_4"],REELWIDTH_4);
		let REELDEN_4=getStrVal(data["REELDEN_4"],REELWIDTH_4);		
		
		if(REELWIDTH_1!=0 && REELDEN_1=="") REELDEN_1=denumire;
		if(REELWIDTH_2!=0 && REELDEN_2=="") REELDEN_2=denumire;
		if(REELWIDTH_3!=0 && REELDEN_3=="") REELDEN_3=denumire;
		if(REELWIDTH_4!=0 && REELDEN_4=="") REELDEN_4=denumire;
		
		let sqlInser='insert into '+tabPlanificare+'(UID,DATA,COD_SORT,DEN_SORT,COD_CEPI,REELWIDTH_1,REELSUBST_1,REELDEN_1,REELCLIENT_1,REELWIDTH_2,REELSUBST_2,REELDEN_2,REELCLIENT_2,REELWIDTH_3,REELSUBST_3,REELDEN_3,REELCLIENT_3,REELWIDTH_4,REELSUBST_4,REELDEN_4,REELCLIENT_4,CANTITATE,DIAM_INT,DIAM_EXT) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
		if(op=="modify"){
			sqlInser="update "+tabPlanificare+" set UID=?,DATA=?,COD_SORT=?,DEN_SORT=?,COD_CEPI=?,REELWIDTH_1=?,REELSUBST_1=?,REELDEN_1=?,REELCLIENT_1=?,REELWIDTH_2=?,REELSUBST_2=?,REELDEN_2=?,REELCLIENT_2=?,REELWIDTH_3=?,REELSUBST_3=?,REELDEN_3=?,REELCLIENT_3=?,REELWIDTH_4=?,REELSUBST_4=?,REELDEN_4=?,REELCLIENT_4=?,CANTITATE=?,DIAM_INT=?,DIAM_EXT=? where uid='"+data.UID+"'";
		}
		const result = await pool.query(sqlInser,
		[	data.UID,
			dataNow,
			data.COD_SORT,
			denumire,
			cod_CEPI,
			REELWIDTH_1,
			REELSUBST_1,
			REELDEN_1,
			REELCLIENT_1,
			REELWIDTH_2,
			REELSUBST_2,
			REELDEN_2,
			REELCLIENT_2,
			REELWIDTH_3,
			REELSUBST_3,
			REELDEN_3,
			REELCLIENT_3,
			REELWIDTH_4,
			REELSUBST_4,
			REELDEN_4,
			REELCLIENT_4,			
			data.CANTITATE,
			data.DIAM_INT,
			data.DIAM_EXT
		]); 
		return {save:"ok"}
	}catch(err){
		throw new Error(err)
	}
}
exports.set=set;