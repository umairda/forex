var mongoose = require('mongoose');
var Ohlc = mongoose.model('Ohlc');

var getDifferenceHelper = function(pair,period,sdate,result) {
	console.log(pair,sdate,period);
	return Ohlc.find({instrument:pair})
	.where('date')
	.lte(sdate)
	.limit(+period)
	.select('instrument date open high low close openinterest volume -_id')
	.sort({date:-1})
	.exec(function(err,docs) {
		var last = docs.length-1;
		var pct_diff = 100*(docs[0].close-docs[last].close)/docs[last].close;
		result.sdoc = docs[0];
		result.edoc = docs[last];
		result.pct_diff = pct_diff.toFixed(2);
		console.log(result);
	});
};

module.exports = getDifferenceHelper;