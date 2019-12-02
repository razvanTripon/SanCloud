var compression = require('compression');
const fs = require('fs');
const bodyParser = require('body-parser')
const express = require('express');
var cron = require("./cron");
const app = express();
//////////////////////generate log file///////////////////////
const morgan = require('morgan');
var path = require('path');
var rfs = require('rotating-file-stream');
var setari = require.main.require("./setari");
var consolex = require.main.require("./console");



var accessLogStream = rfs('access.log', {
	interval: '1d', // rotate daily
	path: path.join(__dirname, 'log')
})
/////////////traductori/////////////
//console.log("sdfsdfsdfsdfsd")
if (!fs.existsSync(setari.pathToTemp)){
	fs.mkdirSync(setari.pathToTemp);
}
if (!fs.existsSync(setari.pathToTraductoriEvents)){
	fs.mkdirSync(setari.pathToTraductoriEvents);
}

rfs('traductoriEvents.log', {
	interval: '1d', // rotate daily
	path: setari.pathToTraductoriEvents
})
rfs('readsCOMs.log', {
	interval: '1d', // rotate daily
	path: setari.pathToTraductoriEvents
})
//////////////////////
morgan.token('err', function getId(req) {
	return req.error ? req.error : "ok"
});

morgan.token('info', function getId(req) {
	return req.info
});

morgan.token('date', (req, res, tz) => {
	const d = new Date();
	let hours = d.getHours();
	hours = hours < 10 ? '0' + hours : hours;
	let minutes = d.getMinutes();
	minutes = minutes < 10 ? '0' + minutes : minutes;
	let seconds = d.getSeconds();
	seconds = seconds < 10 ? '0' + seconds : seconds;
	return d.toISOString().slice(0, 10) + " " + hours + ":" + minutes + ":" + seconds;
});
var loggerFormat = ':date ":method :url" status: :status time: :response-time :err Info: :info';
app.use(morgan(loggerFormat, {
	skip: function (req, res) {
		return false;//req.error ? false : true;  ///write in log only errors
	},
	stream: accessLogStream
}));
app.use(compression());
app.use(express.static('public'));
//app.use('/css', express.static(__dirname + '/public/css'));
//app.use('/js', express.static(__dirname + '/public/js'));
//app.use('/images', express.static(__dirname + '/public/images'));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.json()) // <==== parse request body as JSON
app.listen(3000, () => {
	app.keepAliveTimeout = 0;
	console.log('Server started at port 3000!')
});

//////////////Load routes////////////////////////////////////////
const routesCantarire = require('./routes/cantarire');
const routesPlanificare = require('./routes/planificare');
const routesAutocomplete = require('./routes/autocomplete');
const routesSearch = require('./routes/search');
const routesNomenclatoare = require('./routes/nomenclatoare');
const routesTraductori = require('./routes/traductori');
const routesPrintEticheta = require('./routes/printEticheta');
const routesUsers = require('./routes/users');
const routesbackups = require('./routes/backups');
const routeslistareCustom = require('./routes/listareCustom');
const routesReports = require('./routes/reports');

app.use('/', routesCantarire);
app.use('/', routesPlanificare);
app.use('/', routesAutocomplete);
app.use('/', routesSearch);
app.use('/', routesNomenclatoare);
app.use('/', routesTraductori);
app.use('/', routesPrintEticheta);
app.use('/', routesUsers);
app.use('/', routesbackups);
app.use('/', routeslistareCustom);
app.use('/', routesReports);

app.route('/api/authenticate').get((req, res, next) => {
	require('./api/authenticate').checkUser(req.query.username, req.query.password).then(data => {
		res.send(data)
	})
		.catch(err => {
			req.error = err;
			res.send({ errMessage: err.message })
		})
})
//handle errors
app.use(function (err, req, res, next) {
	res.status(500).send("URL:" + req.url + " --- " + err)
})
app.use(function (req, res, next) {
	res.status(404).send("Page not found!")
})

//install as service
//     npm install  node-windows
    // var Service = require('node-windows').Service;
    //  var svc = new Service({
    //       name:'SanCloud',
    //       description: 'Aplicatie planificare productie si cantarire',
    //       script: 'C:\\SanCloud\\server.js',

    //  });

    // svc.on('install',function(){
    //     svc.start();
    //  });
    //  svc.install();
 //    svc.uninstall();
