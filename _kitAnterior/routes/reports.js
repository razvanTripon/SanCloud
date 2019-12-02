const express = require('express');
const path = require('path');
const fs = require('fs');
const router = new express.Router();

router.get('/api/generateRaport', (req, res, next) => {
	require('.././api/raports/' + req.query["type"]).genRaport(req.query).then(pathFile => {
		if (fs.existsSync(pathFile)) {

			res.download(pathFile);
		} else {
			res.statusCode = 404;
			res.write('404 sorry not found');
			res.end();
		}
	}).catch(err => {
		res.statusCode = 404;
		res.write('Raportul nu a putut fi generat');
		res.end();
	})
})

module.exports = router;