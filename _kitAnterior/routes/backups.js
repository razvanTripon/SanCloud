const express = require('express');
const router = new express.Router();

router.get('/api/backupNow', (req, res, next) => {
	require('.././api/backup/backupNow').execBackup().then(data => {
		res.send(data)
	})
		.catch(err => {
			req.error = err;
			res.send({ errMessage: err.message })
		})
})

router.get('/api/generateCSV', (req, res, next) => {
	require('.././api/genCSV').generateCSV(req.query["bobina_ini"],req.query["bobina_fin"],req.query["salvare"]).then(data => {
		res.send({gen:data})

	}).catch(err => {
		req.error = err;
		res.send({ errMessage: err.message })
	})
})

router.get('/api/getSetariGenerale', (req, res, next) => {
	require('.././api/getSetariGenerale').get().then(data => {
		res.send(data)

	}).catch(err => {
		req.error = err;
		res.send({ errMessage: err.message })
	})
})
module.exports = router;