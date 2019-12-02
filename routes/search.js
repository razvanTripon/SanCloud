const express = require('express');
const router = new express.Router();

router.get('/api/search/nomp', (req, res, next) => {
	require('.././api/search/nomp').getData(req.query["search"]).then(data => {
		res.send(data)
	})
		.catch(err => {
			req.error = err;
			res.send({ errMessage: err.message })
		})
})

router.get('/api/search/nompOnlySortiment', (req, res, next) => {
	require('.././api/search/nompOnlySortiment').getData(req.query["search"]).then(data => {
		res.send(data)
	})
		.catch(err => {
			req.error = err;
			res.send({ errMessage: err.message })
		})
})

router.get('/api/search/bobina', (req, res, next) => {
	require('.././api/search/bobina').getData(req.query["search"]).then(data => {
		res.send(data)
	})
		.catch(err => {
			req.error = err;
			res.send({ errMessage: err.message })
		})
})

router.get('/api/search/nomf', (req, res, next) => {
	require('.././api/search/nomf').getData(req.query["search"]).then(data => {
		res.send(data)
	})
		.catch(err => {
			req.error = err;
			res.send({ errMessage: err.message })
		})
})


module.exports = router;