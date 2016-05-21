var express = require('express');
var moment = require('moment');
var router = express.Router();

router.get('/',function(req, res, next) { res.send("no pair specified"); });

router.get('/:pair/:sdate/:period', function(req, res, next) {
	var pair = req.params.pair;
	var period = req.params.period;
	var sdate = moment(req.params.sdate).format();
	var result = {};

	var promise = require('./getDifferenceHelper.js')(pair,period,sdate,result);
	promise.then(function(docs) {
		res.json(result);
	});
});

router.get('/:pair/:period', function(req, res, next) {
	var pair = req.params.pair;
	var period = req.params.period;
	var sdate = moment().format();
	var result = {};
	
	var promise = require('./getDifferenceHelper.js')(pair,period,sdate,result);
	promise.then(function(docs) {
		res.json(result);
	});
});

module.exports = router;
