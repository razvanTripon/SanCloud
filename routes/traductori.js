const express = require('express');
const EventEmitter = require('events');
const MonitSerial = require('.././api/monitSerial').readSerial;

const router = new express.Router();
const Stream = new EventEmitter();

router.get('/api/traductori', (req, res) => {
	var id = 0;
	const liniiPreluate = []
	res.writeHead(200, {
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		'Connection': 'keep-alive'
	});
	liniiPreluate.push('stream-open');
	const monitSerial = new MonitSerial();
	setTimeout(()=>{
		monitSerial.readSerialsPorts();
	},2000)
	const subscription = monitSerial.getEvent().subscribe(
		data => {
			Stream.emit('push', 'message', data);
		}
	)
	res.flush();
	Stream.on('push', function (event, data) {
		id++;
		res.write('id:' + id + ' event' + String(event) + '\n' + 'data: ' + data + '\n\n');
		liniiPreluate.push(data)
		req.info = liniiPreluate
		res.flush();
	})

	req.on('close', () => {
		monitSerial.closeSerialPort()
		liniiPreluate.push("stream-close")
		req.info = liniiPreluate
		Stream.removeAllListeners();
		res.end();
		subscription.unsubscribe();
		clearInterval(interval);
	});

	//force the connection to stay alive
	var interval = setInterval(function () {
		Stream.emit('push', 'message', JSON.stringify({ ping:"test" }))
	}, 15000);
});

module.exports = router;