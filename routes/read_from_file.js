var express = require('express');
var router = express.Router();
var dataFilesPath = require('./dataFilesPath.js');

router.get('/',function(req, res, next) { res.send("no pair specified"); });

router.get('/:pair/:sdate*?', function(req, res, next) {
	var pair = req.params.pair;
	var sdate = req.params.sdate;
	var allowed_pairs = ['eurusd','audcad'];
	var filename = dataFilesPath.value+pair+'.dly';
	
	require('fs').stat(filename,function(err,stats) {
		if (err) 
		{
			console.log('Error: ',err.code);
			res.json({success:0,message:err});
		}
		else if (stats.isFile()) 
		{
			var data = [];
			var result = require('./read_from_file_helper.js')(data,filename);
			result.on('close', function() {
				if (sdate) {
					var sTime = new Date(sdate);
					sTime.setDate(sTime.getDate()-1);
					var returnData=[];
					for(var i=0; i<data.length; i++)
					{
						var segment = data[i];
						for (var j=0; j<segment.length; j++) {
							console.log(segment[j]);
							if (typeof segment[j].Date !== 'undefined') {
								var cTime = (new Date(segment[j].Date)).getTime();
								console.log(segment[j].Date,cTime,sTime,cTime>sTime);
								if(cTime>=sTime) {
									console.log('end');
									returnData.push(segment.slice(j,segment.length));
									break;
								}
							}
						}
					}
					res.json({success:1,data:returnData});
				}
				else res.json({success:1,data:data});
			});
		}
		else res.json({success:0,message:"invalid pair: " + pair});
	});
});

module.exports = router;
