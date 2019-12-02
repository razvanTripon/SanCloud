const express = require('express');
const router = new express.Router();

router.get('/api/customList/infoCodProdus', (req, res, next) => {
	require('.././api/customList/infoCodProdus').get(req.query["cod_p"]).then(data => {
		res.send(data)
	})
		.catch(err => {
			req.error = err;
			res.send({ errMessage: err.message })
		})
})



module.exports = router;