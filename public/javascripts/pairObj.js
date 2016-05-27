'use strict'

var app = angular.module('forex');

app.factory('pairObjFactory', function($q, dbHandler, fileHandler, splitMongoDate) {
	var pairObj = function(c1,c2,period) {
		this.c1 = c1;
		this.c2 = c2;
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
		
		this.readAndStore = function() {
			var _this = this;
			var c1 = this.c1;
			var c2 = this.c2;
			var pair = c1+c2;
			var deferred = $q.defer();
			var status = '';
			
			if (c1 != c2) {		
				fileHandler.read(pair).then(function (fileResponse) {
					if (fileResponse.data && fileResponse.data.success) {
						var promise = dbHandler.storeArray(pair,fileResponse.data.data,[]);
						promise.then(function(dbResponse) {
							var recordsAdded=0;
							for (var i=0; i<dbResponse.length; i++) {
								recordsAdded+=+dbResponse[i].data.status.replace(/[a-z\s]/gi,'');
							}
							status = recordsAdded+" records added";
							deferred.resolve(status);
							_this.setDates();
						}, function(response) {
							console.log("ERROR");
							console.log(response);
							console.log("config");
							console.log(response.config);
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
		}
		
		this.setDates = function() {
			var _this = this;
			dbHandler.getDates(this.c1+this.c2).then(function(dbResponse) {
				console.log(dbResponse);
				var start = 0, end = 0;
				if (dbResponse.data && dbResponse.data.start && dbResponse.data.end) {
					start = splitMongoDate(dbResponse.data.start.date).ymd;
					end = splitMongoDate(dbResponse.data.end.date).ymd;
					console.log(start,end);
				}
				_this.dbStartDate=start;
				_this.dbEndDate=end;
			});
		};
		
		this.setDifference = function() {
			this.difference = '-';
			if (this.c1 != this.c2) {
				var date = new Date();
				var _this = this;
				date = [date.getYear(),date.getMonth(),date.getDay()].join('-');
				dbHandler.getDifference(this.c1+this.c2,new Date(),this.period).then(function(response) {
					if (response && response.data.pct_diff) {
						_this.difference=response.data.pct_diff;
					}
				});
			}
		};
	};
	
	return {
		pairObj: pairObj
	}
});