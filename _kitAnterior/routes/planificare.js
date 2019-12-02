const express = require('express');
const router = new express.Router();


router.get('/api/planificare/saveComanda', (req, res, next) => {
	require('.././api/planificare/saveComanda').set(req.query, req.query.op).then(data => {
		res.send(data)
	})
		.catch(err => {
			req.error = err;
			res.send({ errMessage: err.message })
		})
})

router.get('/api/planificare/editComanda', (req, res, next) => {
	require('.././api/planificare/editComanda').get().then(data => {
		res.send(data)
	})
		.catch(err => {
			req.error = err;
			res.send({ errMessage: err.message })
		})
})

router.get('/api/planificare/gridComanda', (req, res, next) => {
	require('.././api/planificare/gridComanda').getRows().then(data => {
		res.send(data)
	})
		.catch(err => {
			req.error = err;
			res.send({ errMessage: err.message })
		})
})
module.exports = router;