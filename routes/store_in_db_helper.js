'use strict'

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Ohlc = mongoose.model('Ohlc');

var store_in_db_helper = function(pair,data_arr) {
	var ohlc = new Ohlc({	instrument:pair,
							date:(new Date(data_arr.Date.replace('/','-'))).toISOString(),
							open:parseFloat(data_arr.Open),
							high:+data_arr.High,
							low:+data_arr.Low,
							close:+data_arr.Close,
							volume:+data_arr.Volume,
							openinterest:+data_arr.OpenInterest	});
						
	console.log("-----------\nCREATED ohlc model: "+JSON.stringify(ohlc,null,3));
	
	return ohlc.save(function(err) {
		var error=1;
		if (err && err.code != 11000) { 
			console.log("-----------\nSAVE FAILED: Error code: "+err.code);
		}
		else if (err && err.code === 11000)  //duplicate key
		{								
			console.log("-----------\nSAVE FAILED: Duplicate Data"); 
		}
		else	//no errors
		{
			console.log("-----------\nNo errors");
			error=0;
		}
	});
};

module.exports = store_in_db_helper;