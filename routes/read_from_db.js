var express = require('express');
var moment = require('moment');
var mongoose = require('mongoose');
var Ohlc = mongoose.model('Ohlc');
var router = express.Router();

router.get('/',function(req, res, next) { res.send("no pair specified"); });

router.get('/:pair', function(req, res, next) {
	Ohlc.find({instrument:req.params.pair.toLowerCase()}, {_id:0,instrument:0},function(err,ohlcs) {
		res.json(ohlcs);
	});	
});

router.get('/:pair/:sdate/:edate', function(req, res, next) {
	Ohlc.find({instrument:req.params.pair.toLowerCase()}, {_id:0,instrument:0})
		.where('date').gte(new Date(req.params.sdate)).lte(new Date(req.params.edate))
		.exec(function(err, ohlcs) {
			res.json(ohlcs);
	});
});

router.get('/:pair/after/:date', function(req, res, next) {
	Ohlc.find({instrument:req.params.pair.toLowerCase()}, {_id:0,instrument:0})
		.where('date').gte(new Date(req.params.date))
		.exec(function(err, ohlcs) {
			res.json(ohlcs);
	});
});

router.get('/:pair/before/:date', function(req, res, next) {
	Ohlc.find({instrument:req.params.pair.toLowerCase()}, {_id:0,instrument:0})
		.where('date').lte(new Date(req.params.date))
		.exec(function(err, ohlcs) {
			res.json(ohlcs);
	});
});

router.get('/:pair/:syear/:smonth/:sday/:eyear/:emonth/:eday', function(req, res, next) {
	var sdate = req.params.syear+'-'+req.params.smonth+'-'+req.params.sday;
	var edate = req.params.eyear+'-'+req.params.emonth+'-'+req.params.eday;
	Ohlc.find({instrument:req.params.pair.toLowerCase()}, {_id:0,instrument:0})
		.where('date').gte(new Date(sdate)).lte(new Date(edate))
		.exec(function(err, ohlcs) {
			res.json(ohlcs);
	});
});

router.get('/:pair/after/:syear/:smonth/:sday', function(req, res, next) {
	var sdate = req.params.syear+'-'+req.params.smonth+'-'+req.params.sday;
	Ohlc.find({instrument:req.params.pair.toLowerCase()}, {_id:0,instrument:0})
		.where('date').gte(new Date(sdate))
		.exec(function(err, ohlcs) {
			res.json(ohlcs);
	});
});

router.get('/:pair/before/:syear/:smonth/:sday', function(req, res, next) {
	var sdate = req.params.syear+'-'+req.params.smonth+'-'+req.params.sday;
	Ohlc.find({instrument:req.params.pair.toLowerCase()}, {_id:0,instrument:0})
		.where('date').lte(new Date(sdate))
		.exec(function(err, ohlcs) {
			res.json(ohlcs);
	});
});

router.get('/:pair/:field', function(req, res, next) {
	var field = req.params.field;
	if (typeof Ohlc.schema.paths[field]!='undefined')
	{
		var fields = {'_id':0,'date':1};
		fields[field]=1;
		Ohlc.find({instrument:req.params.pair.toLowerCase()}, fields, function(err,ohlcs) {
			var length = Object.keys(ohlcs).length;
			var data = {};
			var i=0;
			
			Object.keys(ohlcs).map(function(value,index) {
				var formatted_date = moment(ohlcs[value].date).format('YYYY-MM-DD').toString();
				var temp = ohlcs[value];
				data[formatted_date] = temp[field];
				i++;
				if (i>length-1) res.json(data);
			});
		});
	}
	else res.json({});
});

module.exports = router;
