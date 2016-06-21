var express = require('express');
var mongoose = require('mongoose');
var Ohlc = mongoose.model('Ohlc');
var router = express.Router();

router.get('/',function(req, res, next) { res.send("no pair specified"); });

router.get('/:pair', function(req, res, next) {
	var pair = req.params.pair;
	Ohlc.findOne({instrument:pair}).sort('-date').exec(function(err,docs) {
		res.json(docs);
	});
});

module.exports = router;
