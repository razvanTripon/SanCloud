const express = require('express');
const router = new express.Router();

router.get('/api/autocomplete/nomp', (req, res, next) => {
	require('.././api/autocomplete/nomp').getData(req.query["search"]).then(data => {
		res.send(data)
	})
		.catch(err => {
			req.error = err;
			res.send({ errMessage: err.message })
		})
})

router.get('/api/autocomplete/nompOnlySortiment', (req, res, next) => {
	require('.././api/autocomplete/nompOnlySortiment').getData(req.query["search"]).then(data => {
		res.send(data)
	})
		.catch(err => {
			req.error = err;
			res.send({ errMessage: err.message })
		})
})

router.get('/api/autocomplete/nomf', (req, res, next) => {
	require('.././api/autocomplete/nomf').getData(req.query["search"]).then(data => {
		res.send(data)
	})
		.catch(err => {
			req.error = err;
			res.send({ errMessage: err.message })
		})
})

router.get('/api/autocomplete/nomfParinte', (req, res, next) => {
	require('.././api/autocomplete/nomfParinte').getData(req.query["search"]).then(data => {
		res.send(data)
	})
		.catch(err => {
			req.error = err;
			res.send({ errMessage: err.message })
		})
})

router.get('/api/autocomplete/noml', (req, res, next) => {
	require('.././api/autocomplete/noml').getData(req.query["search"]).then(data => {
		res.send(data)
	})
		.catch(err => {
			req.error = err;
			res.send({ errMessage: err.message })
		})
})

router.get('/api/autocomplete/nomlByClient', (req, res, next) => {
	require('.././api/autocomplete/nomlByClient').getData(req.query["search"], req.query["client"]).then(data => {
		res.send(data)
	})
		.catch(err => {
			req.error = err;
			res.send({ errMessage: err.message })
		})
})

module.exports = router;