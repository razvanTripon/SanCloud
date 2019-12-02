const express = require('express');
const router = new express.Router();
//const sd = require('send');
//sd.mime.default_type = 'text/plain'

 var fs = require('fs');
 var path = require('path');

router.get('/api/getLogsName',(req, res, next) => {
	require('.././api/viewlogs/methLogs').getLogs().then(data => {
		res.send(data)
	})
	.catch(err => {
		req.error = err;
		res.send({ errMessage: err.message })
	})
})
router.get('/api/emptyTmpLog',(req, res, next) => {
	require('.././api/viewlogs/methLogs').emptyViewLogs().then(data => {
		res.send({status:data})
	})
	.catch(err => {
		req.error = err;
		res.send({ errMessage: err.message })
	})
})


module.exports = router;