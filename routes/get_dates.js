var express = require('express');
var mongoose = require('mongoose');
var Ohlc = mongoose.model('Ohlc');
var router = express.Router();

router.get('/',function(req, res, next) { res.send("no pair specified"); });

router.get('/:pair', function(req, res, next) {
	var pair = req.params.pair.toLowerCase();
	Ohlc.find({instrument:pair})
		.sort('date')
		.select('instrument date -_id')
		.exec(function(err,docs) {
			var last = docs.length-1;
			res.json({start:docs[0],end:docs[last]});
	});
});

module.exports = router;
