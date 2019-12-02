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

		
		const dataNow=moment().format('YYYY-MM-DD HH:mm:ss');
		
		const REELWIDTH_1=getNumVal(data["REELWIDTH_1"]);
		const REELSUBST_1=getNumVal(data["REELSUBST_1"]);
		const REELCLIENT_1=getStrVal(data["REELCLIENT_1"],REELWIDTH_1);
		let REELDEN_1=getStrVal(data["REELDEN_1"],REELWIDTH_1);
		const REELSORT_1=getStrVal(data["REELSORT_1"],REELWIDTH_1)
		const REELCEPI_1=getStrVal(data["REELCEPI_1"],REELWIDTH_1);
		

		const REELWIDTH_2=getNumVal(data["REELWIDTH_2"]);
		const REELSUBST_2=getNumVal(data["REELSUBST_2"]);
		const REELCLIENT_2=getStrVal(data["REELCLIENT_2"],REELWIDTH_2);
		let REELDEN_2=getStrVal(data["REELDEN_2"],REELWIDTH_2);
		const REELSORT_2=getStrVal(data["REELSORT_2"],REELWIDTH_2)
		const REELCEPI_2=getStrVal(data["REELCEPI_2"],REELWIDTH_2);

		const REELWIDTH_3=getNumVal(data["REELWIDTH_3"]);
		const REELSUBST_3=getNumVal(data["REELSUBST_3"]);
		const REELCLIENT_3=getStrVal(data["REELCLIENT_3"],REELWIDTH_3);
		let REELDEN_3=getStrVal(data["REELDEN_3"],REELWIDTH_3);
		const REELSORT_3=getStrVal(data["REELSORT_3"],REELWIDTH_3)
		const REELCEPI_3=getStrVal(data["REELCEPI_3"],REELWIDTH_3);

		const REELWIDTH_4=getNumVal(data["REELWIDTH_4"]);
		const REELSUBST_4=getNumVal(data["REELSUBST_4"]);
		const REELCLIENT_4=getStrVal(data["REELCLIENT_4"],REELWIDTH_4);
		let REELDEN_4=getStrVal(data["REELDEN_4"],REELWIDTH_4);	
		const REELSORT_4=getStrVal(data["REELSORT_4"],REELWIDTH_4)
		const REELCEPI_4=getStrVal(data["REELCEPI_4"],REELWIDTH_4);		
		
		let sqlInser='insert into '+tabPlanificare+'(UID,DATA,REELSORT_1,REELCEPI_1,REELWIDTH_1,REELSUBST_1,REELDEN_1,REELCLIENT_1,REELSORT_2,REELCEPI_2,REELWIDTH_2,REELSUBST_2,REELDEN_2,REELCLIENT_2,REELSORT_3,REELCEPI_3,REELWIDTH_3,REELSUBST_3,REELDEN_3,REELCLIENT_3,REELSORT_4,REELCEPI_4,REELWIDTH_4,REELSUBST_4,REELDEN_4,REELCLIENT_4,CANTITATE,DIAM_INT,DIAM_EXT) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
		if(op=="modify"){
			sqlInser="update "+tabPlanificare+" set UID=?,DATA=?,REELSORT_1=?,REELCEPI_1=?,REELWIDTH_1=?,REELSUBST_1=?,REELDEN_1=?,REELCLIENT_1=?,REELSORT_2=?,REELCEPI_2=?,REELWIDTH_2=?,REELSUBST_2=?,REELDEN_2=?,REELCLIENT_2=?,REELSORT_3=?,REELCEPI_3=?,REELWIDTH_3=?,REELSUBST_3=?,REELDEN_3=?,REELCLIENT_3=?,REELSORT_4=?,REELCEPI_4=?,REELWIDTH_4=?,REELSUBST_4=?,REELDEN_4=?,REELCLIENT_4=?,CANTITATE=?,DIAM_INT=?,DIAM_EXT=? where uid='"+data.UID+"'";
		}
		const result = await pool.query(sqlInser,
		[	data.UID,
			dataNow,
			REELSORT_1,
			REELCEPI_1,
			REELWIDTH_1,
			REELSUBST_1,
			REELDEN_1,
			REELCLIENT_1,
			REELSORT_2,
			REELCEPI_2,
			REELWIDTH_2,
			REELSUBST_2,
			REELDEN_2,
			REELCLIENT_2,
			REELSORT_3,
			REELCEPI_3,
			REELWIDTH_3,
			REELSUBST_3,
			REELDEN_3,
			REELCLIENT_3,
			REELSORT_4,
			REELCEPI_4,
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