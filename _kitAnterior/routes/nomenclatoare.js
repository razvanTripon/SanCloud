const express = require('express');
const router = new express.Router();

/////////////////////NOMF///////////////////////////
router.get('/api/nomf/getAllRows', (req, res, next) => {
	require('.././api/nomf/getAllRows').getData().then(data => {
		res.send(data)
	})
		.catch(err => {
			req.error = err;
			res.send({ errMessage: err.message })
		})
})
router.get('/api/nomf/getRow', (req, res, next) => {
	require('.././api/nomf/getRow').getData(req.query["cod"]).then(data => {
		res.send(data)
	})
		.catch(err => {
			req.error = err;
			res.send({ errMessage: err.message })
		})
})
router.post('/api/nomf/saveRow', (req, res, next) => {
	require('.././api/nomf/saveRow').setData(req.body, req.query.op).then(data => {
		res.send(data)
	})
		.catch(err => {
			req.error = err;
			res.send({ errMessage: err.message })
		})
})
router.get('/api/nomf/deleteRow', (req, res, next) => {
	require('.././api/nomf/deleteRow').deleteRowNomf(req.query.cod).then(data => {
		res.send(data)
	})
		.catch(err => {
			req.error = err;
			res.send({ errMessage: err.message })
		})
})

////////////////NOMP///////////////////////////////////////
router.get('/api/nomp/getAllRows', (req, res, next) => {
	require('.././api/nomp/getAllRows').getData().then(data => {
		res.send(data)
	})
		.catch(err => {
			req.error = err;
			res.send({ errMessage: err.message })
		})
})
router.get('/api/nomp/getRow', (req, res, next) => {
	require('.././api/nomp/getRow').getData(req.query["codp"]).then(data => {
		res.send(data)
	})
		.catch(err => {
			req.error = err;
			res.send({ errMessage: err.message })
		})
})
router.post('/api/nomp/saveRow', (req, res, next) => {
	require('.././api/nomp/saveRow').setData(req.body, req.query.op).then(data => {
		res.send(data)
	})
		.catch(err => {
			req.error = err;
			res.send({ errMessage: err.message })
		})
})
router.get('/api/nomp/deleteRow', (req, res, next) => {
	require('.././api/nomp/deleteRow').deleteRowNomp(req.query.cod).then(data => {
		res.send(data)
	})
		.catch(err => {
			req.error = err;
			res.send({ errMessage: err.message })
		})
})

module.exports = router;