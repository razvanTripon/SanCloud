const express = require('express');
const router = new express.Router();
const fs = require('fs');

router.get('/api/viewEticheta',(req, res, next) => {
	require('.././api/print/createPDF').createPDF(req.query["uid"],false).then(pdf=>{
		try {
			if(fs.existsSync(pdf)){
				res.download(pdf);
			}else{
				res.send({rapgenerat:false})
			}
		} catch(err) {
			res.send({rapgenerat:false})
		}
	})
})

router.get('/api/viewCustomEticheta',(req, res, next) => {
	require('.././api/print/createPDF').createPDF(req.query,false).then(pdf=>{
		try {
			if(fs.existsSync(pdf)){
				res.download(pdf);
			}else{
				res.send({rapgenerat:false})
			}
		} catch(err) {
			res.send({rapgenerat:false})
		}
	})
})

router.get('/api/printEticheta',(req, res, next) => {
	require('.././api/print/createPDF').createPDF(req.query["uid"],true).then(pdf=>{
		res.send({rapgenerat:false})
	})
})

module.exports = router;