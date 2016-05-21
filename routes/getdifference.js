var express = require('express');
var moment = require('moment');
var mongoose = require('mongoose');
var Ohlc = mongoose.model('Ohlc');
var router = express.Router();

router.get('/',function(req, res, next) { res.send("no pair specified"); });

router.get('/:pair/:sdate/:period', function(req, res, next) {
	var pair = req.params.pair;
	var period = req.params.period;
	var sdate = moment(req.params.sdate).format();
	//var edate_obj = moment(sdate).subtract(period,'days');
	//var edate = edate_obj.format('YYYY-MM-DD');
	console.log(pair,sdate,period);
	Ohlc.find({instrument:pair})
	.where('date')
	.lte(sdate)
	.limit(+period)
	.select('instrument date open high low close openinterest volume')
	.sort({date:-1})
	.exec(function(err,docs) {
		var last = docs.length-1;
		console.log('docs0',docs[0]);
		console.log('docs last',docs[last]);
		//res.json([docs[0],docs[docs.length-1]]);	
		var pct_diff = 100*(docs[0].close-docs[last].close)/docs[last].close;
		console.log('pct_diff',pct_diff.toFixed(2));
		res.json(+pct_diff.toFixed(2));
	});
});

module.exports = router;
