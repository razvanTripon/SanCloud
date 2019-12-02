var pool = require('../databaseConnection');
var tb=require('../getTableName');

async function getRows(){
	try{
		const tabCantarire=await tb.getTableCantarire();
		const tabPlanificare=await tb.getTablePlanificare();

		const resuid=await pool.query(`select * from ${tabPlanificare} order by data desc limit 1`);
		const uid=resuid[0][0] ? resuid[0][0]["UID"] : "" ;
		const result = await pool.query(`
			select * from(
				select "REEL1" AS UID,COD_SORT,REELDEN_1 as DEN_SORT,COD_CEPI,REELWIDTH_1 as REELWIDTH,REELSUBST_1 as REELSUBST,REELDEN_1 as REELDEN,REELCLIENT_1 as REELCLIENT,DIAM_INT,DIAM_EXT,UID AS UIDGENERAL,if(c.greutate is null,0,greutate) as CANT,if(f.nume is null,'',f.nume) DEN_CLIENT
					from ${tabPlanificare} p
					LEFT OUTER JOIN (SELECT bobina,tambur,round(SUM(greutate)/1000,3) AS greutate FROM ${tabCantarire} WHERE bobina='${uid}' AND tambur="REEL1" ) c ON c.bobina=p.uid
					LEFT OUTER JOIN nomf f on f.cod=p.REELCLIENT_1
					where uid='${uid}'
					and REELWIDTH_1!=0
				
				UNION ALL
				
				select "REEL2" AS UID,COD_SORT,REELDEN_2 as DEN_SORT,COD_CEPI,REELWIDTH_2 as REELWIDTH,REELSUBST_2 as REELSUBST,REELDEN_2 as REELDEN,REELCLIENT_2 as REELCLIENT,DIAM_INT,DIAM_EXT,UID AS UIDGENERAL,if(c.greutate is null,0,greutate) as CANT,if(f.nume is null,'',f.nume) DEN_CLIENT
					from ${tabPlanificare} p
					LEFT OUTER JOIN (SELECT bobina,tambur,round(SUM(greutate)/1000,3) AS greutate FROM ${tabCantarire} WHERE bobina='${uid}' AND tambur="REEL2" ) c ON c.bobina=p.uid
					LEFT OUTER JOIN nomf f on f.cod=p.REELCLIENT_2
					where uid='${uid}' and REELWIDTH_2!=0
				
				UNION ALL

				select "REEL3" AS UID,COD_SORT,REELDEN_3 as DEN_SORT,COD_CEPI,REELWIDTH_3 as REELWIDTH,REELSUBST_3 as REELSUBST,REELDEN_3 as REELDEN,REELCLIENT_3 as REELCLIENT,DIAM_INT,DIAM_EXT,UID AS UIDGENERAL,if(c.greutate is null,0,greutate) as CANT,if(f.nume is null,'',f.nume) DEN_CLIENT
					from ${tabPlanificare} p
					LEFT OUTER JOIN (SELECT bobina,tambur,round(SUM(greutate)/1000,3) AS greutate FROM ${tabCantarire} WHERE bobina='${uid}' AND tambur="REEL3" ) c ON c.bobina=p.uid
					LEFT OUTER JOIN nomf f on f.cod=p.REELCLIENT_3
					where uid='${uid}' and REELWIDTH_3!=0
					
					UNION ALL
					
				select "REEL4" AS UID,COD_SORT,REELDEN_4 as DEN_SORT,COD_CEPI,REELWIDTH_3 as REELWIDTH,REELSUBST_4 as REELSUBST,REELDEN_4 as REELDEN,REELCLIENT_4 as REELCLIENT,DIAM_INT,DIAM_EXT,UID AS UIDGENERAL,if(c.greutate is null,0,greutate) as CAN,if(f.nume is null,'',f.nume) DEN_CLIENT 
					from ${tabPlanificare} p
					LEFT OUTER JOIN (SELECT bobina,tambur,round(SUM(greutate)/1000,3) AS greutate FROM ${tabCantarire} WHERE bobina='${uid}' AND tambur="REEL4" ) c ON c.bobina=p.uid
					LEFT OUTER JOIN nomf f on f.cod=p.REELCLIENT_4
					where uid='${uid}' and REELWIDTH_4!=0
			) rs 		
			`);


		const cresult = await pool.query(`
				SELECT 
					if(CANT_PLANIFICAT is null,0,CANT_PLANIFICAT) as CANT_PLANIFICAT,
					if(CANT_REALIZATA is null,0,CANT_REALIZATA) as CANT_REALIZATA,
					if(CANT_PLANIFICAT is null,0,CANT_PLANIFICAT)-if(CANT_REALIZATA is null,0,CANT_REALIZATA) AS CANT_RAMASA
					FROM(
						SELECT p.cantitate AS CANT_PLANIFICAT,c.greutate AS CANT_REALIZATA 
						FROM ${tabPlanificare} p
						LEFT OUTER JOIN (SELECT bobina, ROUND(SUM(greutate)/1000,3) AS greutate  FROM ${tabCantarire} WHERE bobina='${uid}' GROUP BY bobina) c ON p.uid=c.bobina
						WHERE uid="${uid}"
						
					) hh
		`);
		let datatitle=typeof resuid[0][0]=="undefined" ? {} : resuid[0][0];
		datatitle["CANT_PLANIFICAT"]=typeof cresult[0][0]=="undefined" ? 0 : cresult[0][0]["CANT_PLANIFICAT"];
		datatitle["CANT_REALIZATA"]=typeof cresult[0][0]=="undefined" ? 0 : cresult[0][0]["CANT_REALIZATA"];
		datatitle["CANT_RAMASA"]=typeof cresult[0][0]=="undefined" ? 0 : cresult[0][0]["CANT_RAMASA"];
		
		return {
			dataGrid:result[0],
			dataTitle:datatitle			
		}
	}catch(err){
		throw new Error(err)
	}
}
exports.getRows=getRows;