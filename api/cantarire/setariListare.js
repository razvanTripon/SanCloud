var pool = require('../databaseConnection');
const childProcess = require('child_process');

const setari={
	PAPER_WIDTH:0, 
    PAPER_HEIGHT:0,
    PAPER_FORMAT:"A3",
    PAPER_MARGIN_TOP:"5",
    PAPER_MARGIN_BOTTOM:"5",
    PAPER_MARGIN_LEFT:"5",
    PAPER_MARGIN_RIGHT:"5",
    PAPER_ORIENTATION:"LANDSCAPE",
	PAPER_COPIES:2,
	PRINTER:"",
	PAGER_ROTATE:0,
	MARJA_DIAMETRU:0	
}

async function getSetari(){
	try{
		const result = await pool.query(`SELECT NAME,VALUE FROM variabile WHERE section='CANTARIRE' `); 
		for(let row of result[0]){
			if(setari.hasOwnProperty(row["NAME"])){
				setari[row["NAME"]]=row["VALUE"];
			}
		}
		//const printers=await listPrinters();
		setari["PRINTERS"]=[setari.PRINTER]
		return 	setari;
	}catch(err){
		throw new Error(err)
	}
}

async function getPrinters(){
	const printers=await listPrinters();
	return {PRINTERS:printers}
}

listPrinters = () => {
	return new Promise((resolve, reject) => {
		childProcess.exec('wmic printer get name', function (error, stdout) {
			if (error) {
				reject(error)
			} else {
				let cc = stdout.split("\r\n").map(item => { return item.replace("\r", "").trim() }).filter(item => item != "")
				if(cc.length>0) cc.shift()
				resolve(cc)
			}
		})
	})
}

getSetariList=()=>{
	let ret="";
	let bl=true;
	for(const key in setari){
		let semn=",";
		if(bl){
			semn="";
			bl=false;
		}
		ret+=semn+"'"+key+"'";
	}
	return ret;
}

generateUID=()=>{
    return (Math.random() + (new Date).getTime() / 10000000000000).toString(36).substr(2, 10);
}

async function setSetari(data){

	try{
		const listVars=getSetariList();
		const deleteV = await pool.query(`DELETE FROM variabile WHERE section='CANTARIRE' and NAME in(${listVars}) `);
		for(const key in data){
			insertV = await pool.query(`insert into variabile(UID,USER,SECTION,NAME,VALUE,TIP ) values(?,?,?,?,?,?) `,[generateUID(),"","CANTARIRE",key,data[key],'']);
		}
		return 	{opdelete:"ok"};
	}catch(err){
		throw new Error(err)
	}
}

module.exports.getSetari=getSetari;
module.exports.setSetari=setSetari;
module.exports.getPrinters=getPrinters;
