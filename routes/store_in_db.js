'use strict'

var express = require('express');
var router = express.Router();
var util = require('util');
var dataFilesPath = require('./data_files_path');
var Q = require('q');

router.post('/',function(req, res, next) { res.send("no pair specified"); });

router.post('/:pair', function(req, res, next) {
	var records_processed=0;
	var records_saved=0;
	var pair = req.params.pair;
	var filename = dataFilesPath.value+pair+'.dly';
	var query = req.query;
	var store_in_db_helper = require('./store_in_db_helper.js');
	
	//console.log("req.params="+JSON.stringify(req.params));
	//console.log("query="+JSON.stringify(query));
	if (!query.hasOwnProperty("data")) res.json({status:"Missing data"});
	else 
	{	
		require('fs').stat(filename,function(err,stats) {	
			if (err) console.log('Error: ',err.code);
			else if (stats.isFile()) 						//check if file exists
			{
				var data_arr = query.data;
				var deferred = Q.defer();
				var loop = function(index) {
					var promise = store_in_db_helper(pair,JSON.parse(data_arr[index]))
					return promise.then(function() {
						//console.log('-----------\nvalidationErrorsOrDuplicateKeys',validationErrorsOrDuplicateKeys);
						records_saved++;
						console.log("-----------\nData Saved");
						if (index===0) {
							console.log("index===0");
							return deferred.resolve(records_saved);
						}
						else {
							console.log("iterate");
							return loop(index-1);
						}
					},function(err) {
						console.log("-----------\nERROR caught: ",err);		
						if (index===0) {
							console.log("index===0");
							return deferred.resolve(records_saved);
						}
						else {
							console.log("iterate");
							return loop(index-1);
						}
					});
				};
				
				loop(data_arr.length-1).then(function(recs_saved) {
					console.log("-----------\nSending Headers");
					res.json({status:util.format("complete %d records added",records_saved),recs_saved:recs_saved});
				});
			}
			else res.json({status:"invalid pair: " + pair});
		});
	}
}); 

module.exports = router;
