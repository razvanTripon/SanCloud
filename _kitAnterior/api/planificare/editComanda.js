var pool = require('../databaseConnection');
var tb=require('../getTableName');

async function get(){
	try{
		const tabPlanificare=await tb.getTablePlanificare();
		const result = await pool.query(`
				select UID,
				DATE_FORMAT(DATA,'%Y-%m-%d %H:%i:%s') as DATA,
				COD_SORT,
				DEN_SORT,
				COD_CEPI,
				REELWIDTH_1,
				REELSUBST_1,
				REELDEN_1,
				REELCLIENT_1,
				if(f1.nume is null,'', f1.nume) as LABEL_CLIENT_1,
				REELWIDTH_2,
				REELSUBST_2,
				REELDEN_2,
				REELCLIENT_2,
				if(f2.nume is null,'', f2.nume) as LABEL_CLIENT_2,
				REELWIDTH_3,
				REELSUBST_3,
				REELDEN_3,
				REELCLIENT_3,
				if(f3.nume is null,'', f3.nume) as LABEL_CLIENT_3,
				REELWIDTH_4,
				REELSUBST_4,
				REELDEN_4,
				REELCLIENT_4,
				if(f4.nume is null,'', f4.nume) as LABEL_CLIENT_4,
				CANTITATE,
				DIAM_INT,
				DIAM_EXT
				from ${tabPlanificare} p 
				left outer join nomf f1 on f1.cod=p.REELCLIENT_1
				left outer join nomf f2 on f2.cod=p.REELCLIENT_2
				left outer join nomf f3 on f3.cod=p.REELCLIENT_3
				left outer join nomf f4 on f4.cod=p.REELCLIENT_4
				order by data desc limit 1`); 
		const rez=result[0][0];		
		return {      
			UID: rez["UID"],
            DATA: rez["DATA"],
            COD_SORT: { value: rez["COD_SORT"], label: rez["DEN_SORT"] },
            DEN_SORT: rez["DEN_SORT"],
            COD_CEPI: rez["COD_CEPI"],
            formReelGroup: {
                formReel_1: {
                    REELWIDTH_1: rez["REELWIDTH_1"],
                    REELSUBST_1: rez["REELSUBST_1"],
                    REELDEN_1: rez["REELDEN_1"],
                    REELCLIENT_1:{ value:rez["REELCLIENT_1"], label:rez["LABEL_CLIENT_1"] },
                    LABEL_CLIENT_1:rez["LABEL_CLIENT_1"]
                },
                formReel_2: {
                    REELWIDTH_2: rez["REELWIDTH_2"],
                    REELSUBST_2: rez["REELSUBST_2"],
                    REELDEN_2: rez["REELDEN_2"],
                    REELCLIENT_2: { value:rez["REELCLIENT_2"], label:rez["LABEL_CLIENT_2"] },
                    LABEL_CLIENT_2:rez["LABEL_CLIENT_2"]
                },
                formReel_3: {
                    REELWIDTH_3: rez["REELWIDTH_3"],
                    REELSUBST_3: rez["REELSUBST_3"],
                    REELDEN_3: rez["REELDEN_3"],
                    REELCLIENT_3: { value:rez["REELCLIENT_3"], label:rez["LABEL_CLIENT_3"] },
                    LABEL_CLIENT_3:rez["LABEL_CLIENT_3"]
                },
                formReel_4: {
                    REELWIDTH_4: rez["REELWIDTH_4"],
                    REELSUBST_4: rez["REELSUBST_4"],
                    REELDEN_4: rez["REELDEN_4"],
                    REELCLIENT_4: { value:rez["REELCLIENT_4"], label:rez["LABEL_CLIENT_4"] },
                    LABEL_CLIENT_4:rez["LABEL_CLIENT_4"]
                }
            },
            CANTITATE: rez["CANTITATE"],
            DIAM_INT: rez["DIAM_INT"],
            DIAM_EXT: rez["DIAM_EXT"]
		}
		
	}catch(err){
		throw new Error(err)
	}
}
exports.get=get;