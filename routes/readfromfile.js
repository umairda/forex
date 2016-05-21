var express = require('express');
var router = express.Router();

router.get('/',function(req, res, next) { res.send("no pair specified"); });

router.get('/:pair', function(req, res, next) {
	var pair = req.params.pair;
	var allowed_pairs = ['eurusd','audcad'];
	var filename = 'c:/sierrachart/data/'+pair+'.dly';
	
	require('fs').stat(filename,function(err,stats) {
		if (err) 
		{
			console.log('Error: ',err.code);
			res.json({success:0,message:err});
		}
		else if (stats.isFile()) 
		{
			var data = [];
			var result = require('./read_from_file.js')(data,filename);
			result.on('close', function() {
				res.json({success:1,data:data});
			});
		}
		else res.json({success:0,message:"invalid pair: " + pair});
	});
});

module.exports = router;
