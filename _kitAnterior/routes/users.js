const express = require('express');
const router = new express.Router();

router.get('/api/Users/getAllRows', (req, res, next) => {
	require('.././api/users/usersMethods').getAllRows().then(data => {
		res.send(data)
	})
		.catch(err => {
			req.error = err;
			res.send({ errMessage: err.message })
		})
})

router.get('/api/Users/getRow', (req, res, next) => {
	require('.././api/users/usersMethods').getRow(req.query["codu"]).then(data => {
		res.send(data)
	})
		.catch(err => {
			req.error = err;
			res.send({ errMessage: err.message })
		})
})

router.get('/api/Users/deleteRow', (req, res, next) => {
	require('.././api/users/usersMethods').deleteRow(req.query["codu"]).then(data => {
		res.send(data)
	})
		.catch(err => {
			req.error = err;
			res.send({ errMessage: err.message })
		})
})
router.post('/api/Users/saveRow', (req, res, next) => {
	require('.././api/users/usersMethods').saveRow(req.body, req.query.op).then(data => {
		res.send(data)
	})
		.catch(err => {
			req.error = err;
			res.send({ errMessage: err.message })
		})
})


module.exports = router;