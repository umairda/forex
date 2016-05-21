'use strict'

var app = angular.module('forex.readAndStore', ['ngRoute','routeStyles'])

.config(['$routeProvider',function($routeProvider) {
	$routeProvider.when('/readandstore', {
		templateUrl: '/partials/readandstore',
		controller: 'readAndStoreCtrl',
		css: '/stylesheets/readandstore.css'
	});
}]);

app.service('_update', function($timeout) {
	return {
		show: function($scope,v,value) {
			$scope[v] = value;
			$timeout(function() {
				$scope[v] = null;
			},5000);
		}
	}
});

var ReadAndStoreCtrl = function($scope,$timeout,dbHandler,fileHandler,splitMongoDate,_update) {
	var _this = this;
	
	$scope.currencies = ['aud','cad','chf','eur','gbp','jpy','nzd','usd'];
	$scope.lastDate = [];
	
	$scope.getLast = function(c1,c2) {
		var pair = c1+c2;
		dbHandler.getLast(pair).then(function(dbResponse) {
			
			console.log(dbResponse);
			var date = 0;
			if (dbResponse.data != null) {
				date = splitMongoDate(dbResponse.data.date).ymd;
				console.log(date);
			}
			$scope.lastDate[c1+c2]=date;
			return date;
		});
	};
	
	$scope.readandstore = function(c1,c2) {
		
		var pair = c1+c2;
		
		if (c1 != c2) {		
			fileHandler.read(pair).then(function (fileResponse) {
				if (fileResponse.data != null) {
					var promise = dbHandler.storeArray(pair,fileResponse.data,[]);
					//console.log("typeof promise: ", typeof promise);
					promise.then(function(dbResponse) {
						console.log("db response data",dbResponse);
						var recordsAdded=0;
						for (var i=0; i<dbResponse.length; i++) {
							recordsAdded+=+dbResponse[i].data.status.replace(/[a-z\s]/gi,'');
						}
						_update.show($scope,'update',recordsAdded+" records added");
						$scope.getLast(c1,c2);
					}, function(response) {
						console.log("ERROR");
						console.log(response);
						console.log("config");
						console.log(response.config);
					});
				}
				else console.log(c1+c2+" fileResponse.data == null");
			});
		}
		else console.log(c1+c2+" no data");
	};
	/*
	$timeout(function() {
		console.log($scope);		
	},5000);
	*/
	
};

ReadAndStoreCtrl.$inject = ['$scope','$timeout','dbHandler','fileHandler','splitMongoDate','_update'];

app.controller('readAndStoreCtrl',ReadAndStoreCtrl);