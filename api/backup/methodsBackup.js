var moment = require('moment');
var setari = require.main.require("./setari");
var request = require('request');
var fs = require('fs');
const zlib = require('zlib');
var pool = require('../databaseConnection');


async function getPathMysqlDump() {
	try {
		const sqlText = `SELECT VARIABLE_VALUE FROM information_schema.GLOBAL_VARIABLES WHERE VARIABLE_NAME='BASEDIR'`
		const result = await pool.query(sqlText);
		let path = result[0][0]["VARIABLE_VALUE"] + "bin/";
		path = path.replace(/\\/g, "/");
		pathR=path.substr(0,path.indexOf("/")+1);
		pathrest='"'+path.substr(path.indexOf("/")+1)+'"'
		path=pathR+pathrest
		return path;

	} catch (err) {
		throw new Error(err);
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

async function getTabeleBackup(){
	const tables=["nomf","nomp"];
	try{
		const mmn = moment().format('YYYY');
		const cantarire_cr=`cantarire_${mmn}`;
		const planificare_cr=`planificare_${mmn}`;
		const check_1 = await checkTabela(cantarire_cr);
		const check_2 = await checkTabela(planificare_cr);
		if(check_1) tables.push(cantarire_cr);
		if(check_2) tables.push(planificare_cr);
		return tables;

	}catch(err){
		return tables
	}
}

async function execShellCommand(cmd) {
	const exec = require('child_process').exec;
	return new Promise((resolve, reject) => {
		exec(cmd, (error, stdout, stderr) => {
			if (error) {
				console.warn(error);
			}
			resolve(stdout ? stdout : stderr);
		});
	});
}

async function zipFile(filename, filenameGZ) {
	return new Promise((resolve, reject) => {
		const fileContents = fs.createReadStream(filename);
		const writeStream = fs.createWriteStream(filenameGZ);
		const zip = zlib.createGzip();
		fileContents.pipe(zip).pipe(writeStream).on('finish', (err) => {
			if (err) return reject(err);
			else resolve();
		})
	})
}

async function dumpDB() {
	const mmn = moment().format('YYYY_MM_DD_HH_mm_ss_SSS');
	const fileName = `s1124988_${mmn}.sql`;
	const fileDump = `${setari.pathToTemp}/${fileName}`;
	const fileNameGZ = fileName + ".gz"
	const fileDumpGZ = `${setari.pathToTemp}/${fileNameGZ}`;
	deleteFile(fileDump);
	deleteFile(fileDumpGZ);

	const tabele=await getTabeleBackup();
	const tabeleBackup=tabele.join(" ");
	pathMysqlDump= await getPathMysqlDump();
	const command = pathMysqlDump+`mysqldump -u${setari.mysqlConfig.user} -p${setari.mysqlConfig.password} -h ${setari.mysqlConfig.host} --compact ${setari.mysqlConfig.database} --add-drop-table --ignore-table=${setari.mysqlConfig.database}.firma ${tabeleBackup} >${fileDump}`

	await execShellCommand(command)
		.then(() => {
			zipFile(fileDump, fileDumpGZ).then(() => {
				saveToFolders(fileNameGZ, fileDumpGZ);
				sendToCloud(fileDumpGZ)
			})
		})
	return fileName
}

function deleteFile(path) {
	fs.unlink(path, (err) => {
		if (err) {
			//console.log(err)
			return
		}
	})
}

function saveToFolders(fileName, fileDump) {
	setari.pathToBackup.forEach(path => {
		if (!fs.existsSync(path)) {
			fs.mkdirSync(path);
		}
		deleteFile(path + fileName);
		fs.copyFile(fileDump, path + fileName, (err) => {
			if (err) throw err;
		});
	})
}

function sendToCloud(fileDB) {
	var formData = {
		my_file: fs.createReadStream(fileDB),
	}
	request.post({ url: setari.urlsyncCloud, formData: formData, gzip: true },
		function optionalCallback(err, response, body) {
			if (err) {
				return console.error('upload failed:', err);
			}
			console.log("DB Syncronizare cloud reusita")
		})
}
exports.dumpDB = dumpDB;
