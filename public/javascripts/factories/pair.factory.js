(function() {
	'use strict';

	var app = angular.module('forex.factories');

	app.factory('Pair', function($q, dbHandler, fileHandler, splitMongoDate) {
		var obj = function() { //params: c1,c2; c1,c2,period; pair; pair, period;
		var c1='eur', c2='usd', pair='eurusd', period=60;
			
			switch(arguments.length) {
				case 1: 
					pair=arguments[0]; 
					c1=pair.substr(0,3);
					c2=pair.substr(3,3);
					break;
				case 2: 
					if (angular.isNumber(arguments[1])) {
						pair=arguments[0];
						period=arguments[1];
						c1=pair.substr(0,3);
						c2=pair.substr(3,3);
					}
					else {
						c1=arguments[0];
						c2=arguments[1];
						pair=c1+c2;
					}
					break;
				case 3: 
					c1=arguments[0]; 
					c2=arguments[1]; 
					pair=c1+c2;
					period=arguments[2]; 
					break;			
			}
			
			this.c1 = c1;
			this.c2 = c2;
			this.pair = pair;
			this.period = period;
			this.difference = '-';
			
			this.greatestVsC1 = 0;
			this.leastVsC1 = 0;
			this.greatestVsC2 = 0;
			this.leastVsC2 = 0;
			this.greatest = 0;
			this.least = 0;
			
			this.dbStartDate = 0;
			this.dbEndDate = 0;
			
			/* I thought about breaking up readAndStore into separate "read" and "store" functions for easier testing
			this.read = function() {
				var _this = this;
				var c1 = this.c1;
				var c2 = this.c2;
				var pair = c1+c2;
			}
			*/
			
			this.readAndStore = function() {
				var _this = this;
				var c1 = this.c1;
				var c2 = this.c2;
				var pair = c1+c2;
				var deferred = $q.defer();
				var status = '';
				
				if (c1 !== c2) {
					var fileHandlerPromise=0;
					if (_this.dbEndDate) { fileHandlerPromise = fileHandler.readFromDate(pair,_this.dbEndDate); }
					else { fileHandlerPromise = fileHandler.read(pair); }
				
					fileHandlerPromise.then(function (fileResponse) {
						//console.log('fileResponse',fileResponse);
						if (fileResponse.data && fileResponse.data.success) {
							var promise = dbHandler.storeArray(pair,fileResponse.data.data,[]);
							promise.then(function(dbResponse) {
								console.log('dbResponse',dbResponse);
								var recordsAdded=0;
								for (var i=0; i<dbResponse.length; i++) {
									console.log('dbResponse[i].data.status',dbResponse[i].data.status);
									recordsAdded+=+dbResponse[i].data.status.replace(/[a-z\s]/gi,'');
								}
								status = recordsAdded+" records added";
								deferred.resolve(status);
								_this.setDates();
							}, function(response) {
								console.log("ERROR",response);
								status="error "+response;
								deferred.reject(status);
							});
						}
						else 
						{
							if (fileResponse.data) {
								status = fileResponse.data.message;
								deferred.reject(status);
							}
							else {
								status = 'typeof fileResponse.data ='+typeof fileResponse.data;
								deferred.reject(status);
							}
						}
					});
				}
				else {
					console.log(c1+c2+" no data");
					status = c1+c2+" no data";
					deferred.resolve(status);
				}
				return deferred.promise;
			};
			
			this.setDates = function() {
				var _this = this;
				return dbHandler.getDates(_this.c1+_this.c2).then(function(dbResponse) {
					var start = 0, end = 0;
					if (dbResponse.data && dbResponse.data.start && dbResponse.data.end) {
						start = splitMongoDate(dbResponse.data.start.date).ymd;
						end = splitMongoDate(dbResponse.data.end.date).ymd;
					}
					_this.dbStartDate=start;
					_this.dbEndDate=end;
					
					return _this.pair;
				});
			};
			
			this.setDifference = function() {
				this.difference = '-';
				if (this.c1 !== this.c2) {
					var date = new Date();
					var _this = this;
					date = [date.getYear(),date.getMonth(),date.getDay()].join('-');
					return dbHandler.getDifference(this.c1+this.c2,new Date(),this.period).then(function(response) {
						if (response && response.data.pct_diff) {
							_this.difference=response.data.pct_diff;
						}
					});
				}
			};
		};
		
		return {
			obj: obj,
		};
	});
})();