const express = require('express');
const router = new express.Router();


router.get('/api/cantarire/getProduseCantarite', (req, res, next) => {
	require('.././api/cantarire/getProduseCantarite').getData(req.query["uid"]).then(data => {
		res.send(data)
	})
		.catch(err => {
			req.error = err;
			res.send({ errMessage: err.message })
		})
})

router.get('/api/cantarire/getNewCantarireData', (req, res, next) => {
	require('.././api/cantarire/getNewCantarireData').getData(req.query["uid"]).then(data => {
		res.send(data)
	})
		.catch(err => {
			req.error = err;
			res.send({ errMessage: err.message })
		})
})

router.get('/api/cantarire/getMaxTambur', (req, res, next) => {
	require('.././api/cantarire/getMaxTambur').getData().then(data => {
		res.send(data)
	})
		.catch(err => {
			req.error = err;
			res.send({ errMessage: err.message })
		})
})

router.get('/api/cantarire/saveRowCantarire', (req, res, next) => {
	require('.././api/cantarire/saveRowCantarire').set(req.query).then(data => {
		res.send(data)
	})
		.catch(err => {
			req.error = err;
			res.send({ errMessage: err.message })
		})
})

router.get('/api/cantarire/deleteProduseCantarite', (req, res, next) => {
	require('.././api/cantarire/deleteProduseCantarite').set(req.query["uid"]).then(data => {
		res.send(data)
	})
		.catch(err => {
			req.error = err;
			res.send({ errMessage: err.message })
		})
})

router.get('/api/cantarire/editareaRowCantarire', (req, res, next) => {
	require('.././api/cantarire/editareaRowCantarire').getData(req.query["uid"]).then(data => {
		res.send(data)
	})
		.catch(err => {
			req.error = err;
			res.send({ errMessage: err.message })
		})
})

router.get('/api/cantarire/getSetariListare', (req, res, next) => {
	require('.././api/cantarire/setariListare').getSetari().then(data => {
		res.send(data)
	})
		.catch(err => {
			req.error = err;
			res.send({ errMessage: err.message })
		})
})

router.get('/api/cantarire/getPrinters', (req, res, next) => {
	console.log("dddd")
	require('.././api/cantarire/setariListare').getPrinters().then(data => {
		res.send(data)
	})
		.catch(err => {
			req.error = err;
			res.send({ errMessage: err.message })
		})
})

router.get('/api/cantarire/setSetariListare', (req, res, next) => {
	require('.././api/cantarire/setariListare').setSetari(req.query).then(data => {
		res.send(data)
	})
		.catch(err => {
			req.error = err;
			res.send({ errMessage: err.message })
		})
})

module.exports = router;