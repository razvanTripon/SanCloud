var pool = require('./databaseConnection');
var moment = require('moment');

function getTabAnCurent(type) {
    const an = moment().format('YYYY');
    return type == "cantarire" ? 'cantarire_' + an : 'planificare_' + an;
}

function getTabAnAnt(type) {
    const anAnt = moment().subtract(1, 'years').format('YYYY');
    return type == "cantarire" ? 'cantarire_' + anAnt : 'planificare_' + anAnt;
}

async function initTables() {
    try {
        await createTableCantarire();
        await createTablePlanificare();
    } catch (err) {
        throw new Error(err)
    }
}

async function getTabela(tab, tab_ant) {
    const check_1 = await checkTabela(tab);
    if (!check_1) {
        const check_2 = await checkTabela(tab_ant);
        if (check_2) {
            return tab_ant;
        } else {
            await initTables();
            return tab;
        }
    }
    return tab
}

async function getTableCantarireAnt() {
    const tb_c_ant = getTabAnAnt('cantarire');
    const checkTbc = await checkTabela(tb_c_ant);
    if (checkTbc) {
        return tb_c_ant;
    }
    return "";
}

async function getTablePlanificareAnt() {
    const tb_p_ant = getTabAnAnt('planificare');
    const checkTbc = await checkTabela(tb_p_ant);
    if (checkTbc) {
        return tb_p_ant;
    }
    return "";
}

async function getTableCantarire() {
    const tb_c = getTabAnCurent('cantarire');
    const tb_c_ant = getTabAnAnt('cantarire');
    return await getTabela(tb_c, tb_c_ant);
}

async function getTablePlanificare() {
    const tb_p = getTabAnCurent('planificare');
    const tb_p_ant = getTabAnAnt('planificare');
    return await getTabela(tb_p, tb_p_ant);
}

async function execSql(sqlTxt) {
    try {
        await pool.query(sqlTxt)
            .catch((err) => {
                throw new Error(err)
            });
    } catch (err) {
        throw new Error(err)
    }
}

async function createTablePlanificare() {
    try {
        const tb_p = getTabAnCurent('planificare');
        const createPlanificare = `
            CREATE TABLE IF NOT EXISTS ${tb_p} (
                UID varchar(15) NOT NULL,
                DATA datetime DEFAULT '1900-01-01',
                COD_SORT varchar(15) DEFAULT '',
                DEN_SORT varchar(100) DEFAULT '',
                COD_CEPI int(11) DEFAULT 0,
                
                REELWIDTH_1 double(20,4) DEFAULT 0,
                REELSUBST_1 double(20,4) DEFAULT 0,
                REELDEN_1 varchar(100) DEFAULT 0,
                REELCLIENT_1 varchar(25) DEFAULT '',
                
                REELWIDTH_2 double(20,4) DEFAULT 0,
                REELSUBST_2 double(20,4) DEFAULT 0,
                REELDEN_2 varchar(100) DEFAULT 0,
                REELCLIENT_2 varchar(25) DEFAULT '',
                
                REELWIDTH_3 double(20,4) DEFAULT 0,
                REELSUBST_3 double(20,4) DEFAULT 0,
                REELDEN_3 varchar(100) DEFAULT 0,
                REELCLIENT_3 varchar(25) DEFAULT '',
                
                REELWIDTH_4 double(20,4) DEFAULT 0,
                REELSUBST_4 double(20,4) DEFAULT 0,
                REELDEN_4 varchar(100) DEFAULT 0,
                REELCLIENT_4 varchar(25) DEFAULT '',

                CANTITATE double(20,4) DEFAULT 0,
                DIAM_INT double(20,4) DEFAULT 0,
                DIAM_EXT double(20,4) DEFAULT 0,
                PRIMARY KEY (UID),
                KEY COD_SORT (COD_SORT)
              ) ENGINE=InnoDB DEFAULT CHARSET=utf8
            `
        await execSql(createPlanificare)

    } catch (err) {
        throw new Error(err)
    }
}

async function createTableCantarire() {
    try {
        const tb_c = getTabAnCurent('cantarire');
        const createCantarire = `
        CREATE TABLE IF NOT EXISTS ${tb_c} (
        UID varchar(10) NOT NULL,
        TAMBUR varchar(10) DEFAULT '',
        BOBINA varchar(10) DEFAULT '',
        COD_SORT varchar(15) DEFAULT '',
		DEN_SORT varchar(100) DEFAULT '',
		COD_CEPI varchar(15) DEFAULT '',
		GRAMAJ double(20,4) DEFAULT 0,
        CLIENT varchar(15) DEFAULT '',
        DEN_CLIENT varchar(100) DEFAULT '',
		NR_TAMBUR int(11) DEFAULT 0,
        NR_BOBINA int(11) DEFAULT 0,
        TURA varchar(20) DEFAULT '',
        LATIME double(20,4) DEFAULT 0,
        LUNGIME double(20,4) DEFAULT 0,
        DIAM_INTERIOR double(20,4) DEFAULT 0,
        DIAM_EXTERIOR double(20,4) DEFAULT 0,
        DIAM_TRADUCTOR double(20,4) DEFAULT 0,
        GREUTATE double(20,4) DEFAULT 0,
		DATA datetime DEFAULT '1900-01-01',
        CODOP varchar(60) DEFAULT '',
        PRIMARY KEY (UID),
        KEY BOBINA (BOBINA),
        KEY COD_SORT (COD_SORT),
        KEY NR_BOBINA (NR_BOBINA)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8`;

        await execSql(createCantarire)

    } catch (err) {
        throw new Error(err)
    }
}

async function checkTabela(tableName) {
    try {
        const result = await pool.query(`SHOW TABLES LIKE ?`, [tableName])
            .catch((err) => {
                throw new Error(err)
            })
        return result[0][0] ? true : false;
    } catch (err) {
        throw new Error(err)
    }

}

exports.getTablePlanificare = getTablePlanificare;
exports.getTableCantarire = getTableCantarire;
exports.getTablePlanificareAnt = getTablePlanificareAnt;
exports.getTableCantarireAnt = getTableCantarireAnt;
exports.initTables = initTables;