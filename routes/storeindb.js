var express = require('express');
var router = express.Router();
var moment = require('moment');
var mongoose = require('mongoose');
var Ohlc = mongoose.model('Ohlc');
var util = require('util');
var dataFilesPath = require('./dataFilesPath');

var isNumber = require('./is_number.js');

router.get('/',function(req, res, next) { res.send("no pair specified"); });

router.get('/:pair', function(req, res, next) {
	console.log('STORING');
	var messages = [];
	var records_saved=0;
	var pair = req.params.pair;
	var filename = dataFilesPath.value+pair+'.dly';
	var query = req.query;
	console.log("req.params="+JSON.stringify(req.params));
	console.log("query="+JSON.stringify(query));
	if (!query.hasOwnProperty("data")) res.send('Missing data');
	else 
	{	
		require('fs').stat(filename,function(err,stats) {
			if (err) console.log('Error: ',err.code);
			else if (stats.isFile()) 
			{
				var data_obj = JSON.parse(query.data);
				var columns = data_obj["columns"];
				var types = [];
				for (var j in columns) types[j] = columns[j].type;
				
				Object.keys(data_obj).forEach(function(i) {
					if (1) 
					{
						var ohlc = new Ohlc({	instrument:pair,
												date:moment(data_obj[i].Date).format('YYYY-MM-DD'),
												open:+data_obj[i].Open,
												high:+data_obj[i].High,
												low:+data_obj[i].Low,
												close:+data_obj[i].Close,
												volume:+data_obj[i].Volume,
												openinterest:+data_obj[i].OpenInterest	});
						
						console.log("ohlc: "+JSON.stringify(ohlc,null,3));
						messages.push(util.format("ohlc[%d]: ",i)+JSON.stringify(ohlc,null,3));
					
						ohlc.save(function(err) {
							if (err && err.code != 11000) 
							{ 
								messages.push("err.code="+err.code);
								messages.push(err);
								console.log("error code: "+err.code);
								console.log(err);
								
								if (err.name != 'ValidationError')	next(err); //let validation errors slide
							}
							else if (err && err.code === 11000)  //duplicate key
							{								
								messages.push(util.format("Duplicate data: %j", data_obj[i]));
								console.log("messages err=11000: %s", messages.length);
							}
							else	//no errors
							{
								messages.push(util.format("Data saved: %j", data_obj[i]));
								console.log("messages else: %s", messages.length);
								records_saved++;
							}
							
							console.log(typeof data_obj[+i+1]);
							if (typeof data_obj[+i+1] === 'undefined' && isNumber(+i+1)) {
								console.log("END");
								res.json({status:util.format("complete %d records added",records_saved),messages:messages});
							}
						});			
						
					}
					else 
					{
						console.log("invalid data: "+data_obj[i]);
						messages.push("invalid_data:"+util.format(JSON.stringify(data_obj[i],null,3)));
					}
				});
			}
			else res.json({status:"invalid pair: " + pair, messages:messages});
		});
	}
});

module.exports = router;
