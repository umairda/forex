var mongoose = require('mongoose');

var OhlcSchema = new mongoose.Schema({
	instrument:		{type: String, lowercase:true, required: [true, 'instrument missing']},
	date: 			{type: Date,   required: [true, 'date missing']},
	open: 			{type: Number, required: [true, 'open missing']},
	high: 			{type: Number, required: [true, 'high missing']},
	low: 			{type: Number, required: [true, 'low missing']},
	close: 			{type: Number, required: [true, 'close missing']},
	volume:		 	{type: Number, min:0, default: 0},
	openinterest: 	{type: Number, min:0, default: 0}
});

OhlcSchema.index({instrument:1,date:1},{unique:true});

var model = mongoose.model('Ohlc', OhlcSchema);
model.ensureIndexes(function (err) {
	if (err) console.log(err);
});

module.exports = model;
