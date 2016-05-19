'use strict'

var app = angular.module('forex.readAndStore', ['ngRoute','routeStyles'])

.config(['$routeProvider',function($routeProvider) {
	$routeProvider.when('/readandstore', {
		templateUrl: '/partials/readandstore',
		controller: 'readAndStoreCtrl',
		css: '/stylesheets/readandstore.css'
	});
}]);

var ReadAndStoreCtrl = function($scope,$timeout,dbHandler,fileHandler) {
	var _this = this;
	
	$scope.currencies = ['aud','cad','chf','eur','gbp','jpy','nzd','usd'];
	
	$scope.readandstore = function(c1,c2) {
		
		var pair = c1+c2;
		
		fileHandler.read(pair).then(function (fileResponse) {
			
			dbHandler.store(pair,fileResponse.data).then(function(dbResponse) {
				console.log(dbResponse.data);
				$scope.update = dbResponse.data.status;
				$timeout(function() { $scope.update=''; },5000);
			}, function(response) {
				console.log("ERROR");
				console.log(response);
				console.log("config");
				console.log(response.config);
			});
		});
	};
	
};

ReadAndStoreCtrl.$inject = ['$scope','$timeout','dbHandler','fileHandler'];

app.controller('readAndStoreCtrl',ReadAndStoreCtrl);