const { Subject } = require('rxjs');
const fs = require('fs');
const path = require("path");
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const InterByteTimeout = require('@serialport/parser-inter-byte-timeout')
var setari = require.main.require("./setari");

var moment = require('moment');

const eroareCantitate = `Eroare comunicare cu portul serial pentru citire Greutate -${setari.serialPortGreutate.port}`;
const eroareLungime = `Eroare comunicare cu portul serial pentru citire Lungime si Diametru -${setari.serialPortLungime.port}`;

class readSerial {

	constructor() {
		this.conexiuneOpen = true;
		this.resetConfirm = true;
		this.intervalLungime;
		this.lungime = 0;
		this.subject = new Subject();
		this.fileEvents = setari.pathToTraductoriEvents + 'traductoriEvents.log';
		this.dateCOM = setari.pathToTraductoriEvents + 'readsCOMs.log'
		this.portCantitate = new SerialPort(setari.serialPortGreutate.port, setari.serialPortGreutate.options, (err) => {
			if (err) {
				this.eroarePort(eroareCantitate + err.message, "stop");
				this.closeSerialPort()
			} else {
				console.log("Port greutate conectat")
			}
		});

		this.portLungime = new SerialPort(setari.serialPortLungime.port, setari.serialPortLungime.options, (err) => {
			if (err) {
				this.eroarePort(eroareLungime + err.message, "stop")
				this.closeSerialPort()
			} else {
				console.log("Port Lungime conectat")
			}
		});
	}

	getNumber(str) {
		const num = Number(str.trim());
		return isNaN(num) ? 0 : num
	}

	resetLungime() {
		this.portLungime.write(Buffer.from('0220302003', 'hex'), 'hex');
	}

	eroarePort(mess, type = "warning" | "stop") {
		this.subject.next(JSON.stringify({ err: mess, type: type }));
	}
	statusPort(port = "cantitate" | "lungime", errmsg = "") {
		if (this.conexiuneOpen) {//deconectare acidentala nu venita de la client
			this.eroarePort(
				port == "cantitate" ? eroareCantitate + " " + errmsg : eroareLungime + " " + errmsg,
				port == "cantitate" ? "stop" : "warning"
			)
		} else {
			console.log(`Port ${port} inchis normal`)
		}
	}
	readSerialLungime() {
		let checkPort = 0;
		this.intervalLungime = setInterval(() => {
			if (this.resetConfirm) {
				const buf = Buffer.from('0220312003', 'hex');
				this.portLungime.write(buf);
			}
			if (checkPort > 25) {
				this.statusPort("lungime","Traductorul de lungime/diametru nu raspunde")
				checkPort = 0;
			}
			checkPort++;
		}, 1000)

		const parser = this.portLungime.pipe(new InterByteTimeout({ interval: 50 }))

		parser.on('data', (data) => {
			checkPort = 0;
			const row = Buffer.from(data, 'hex').toString('utf8');
			const dataOp = moment().format('YYYY-MM-DD');
			const timeOp = moment().format('HH:mm:ss');
			this.writeEventToLog(this.dateCOM, dataOp + " " + timeOp + " - Lg & Diam  " + this.remove_non_ascii(row));

			const rowArr = row.split(" ");
			if (rowArr.length == 6) {
				const apasatButon = rowArr[4];
				if (apasatButon == "1") {
					this.resetConfirm = false;
					const lungime = this.getNumber(rowArr[1]);
					let diametrul = this.getNumber(rowArr[2]);
					diametrul = Math.round(diametrul / 10)
					const json = JSON.stringify({ DIAMETRUL: diametrul, LUNGIMEA: lungime, DATA: dataOp, TIME: timeOp });
					this.subject.next(json);
					this.writeEventToLog(this.fileEvents, json);
					this.portLungime.write(Buffer.from('0220302003', 'hex'));
				}
			}
			if (rowArr.length == 3 && rowArr[1] == "R") {
				this.resetConfirm = true;
			}
		})

		this.portLungime.on('close', () => {
			this.statusPort("lungime")
		})

		this.portCantitate.on('close', () => {
			this.statusPort("cantitate")
		})

		this.portLungime.on('error', (err) => {
			this.statusPort("lungime", err.message)
			console.error('Eroare Port lungime ' + err.message)
		})
		this.portCantitate.on('error', (err) => {
			this.statusPort("cantitate", err.message)
			console.error('Eroare Port cantitate ' + err.message)
		})
	}
	readSerialGreutate() {
		const parserCantitate = this.portCantitate.pipe(new InterByteTimeout({ interval: 50 }))
		parserCantitate.on('data', (data) => {
			const dataOp = moment().format('YYYY-MM-DD');
			const timeOp = moment().format('HH:mm:ss');
			let row = Buffer.from(data, 'hex').toString('utf8');

			this.writeEventToLog(this.dateCOM, dataOp + " " + timeOp + " - CANT - " + row);
			row = row.trim();
			let lastElem = "";
			let strNew = "";
			for (let elem of row) {
				if (elem != " " || (elem == " " && lastElem != " ")) {
					strNew += elem;
				}
				lastElem = elem;
			}
			const rrArr = strNew.split(" ");
			if (rrArr.length == 3) {
				// const cant = this.getNumber(row.substr(3, 8));
				const cant = rrArr[1];
				const jsonCant = JSON.stringify({ CANTITATE: cant, DATA: dataOp, TIME: timeOp });
				this.subject.next(jsonCant);
				this.writeEventToLog(this.fileEvents, jsonCant);
			}
		})
	}
	readSerialsPorts() {
		this.readSerialLungime();
		this.readSerialGreutate()
	}

	closeSerialPort() {
		setTimeout(() => {
			this.conexiuneOpen = false;
			if (this.intervalLungime) this.intervalLungime.close();
			if (this.portCantitate.isOpen) this.portCantitate.close(error => { if (error) console.log("Eroare inchidere port cantitate " + error) })
			if (this.portLungime.isOpen) this.portLungime.close(error => { if (error) console.log("Eroare inchidere port lungime " + error) })
		}, 1000)
	}

	getEvent() {
		return this.subject
	}

	writeEventToLog(path, text) {
		fs.appendFileSync(path, text + "\n");
	}

	remove_non_ascii(str) {
		if ((str===null) || (str===''))
		   return false;
		else
		str = str.toString();
		return str.replace(/[^\x20-\x7E]/g, '');
	}

}

module.exports.readSerial = readSerial;