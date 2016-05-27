'use strict'

var app = angular.module('forex.readAndStore', ['ngRoute','routeStyles'])

.config(['$routeProvider',function($routeProvider) {
	$routeProvider.when('/readandstore', {
		templateUrl: '/partials/readandstore',
		controller: 'readAndStoreCtrl',
		css: '/stylesheets/readandstore.css'
	});
}]);

//Displays an update message for 5 seconds
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

var ReadAndStoreCtrl = function($scope,pairObjFactory,_update) {
	
	$scope.currencies = ['aud','cad','chf','eur','gbp','jpy','nzd','usd'];
	$scope.pairs = [];
	$scope.update = '';
	
	for (var i=0; i<$scope.currencies.length; i++) {
		var c1 = $scope.currencies[i];
		$scope.pairs[c1] = [];
		for (var j=0; j<$scope.currencies.length; j++) {
			var c2 = $scope.currencies[j];
			$scope.pairs[c1][c2]=new pairObjFactory.pairObj(c1,c2,0);
			$scope.pairs[c1][c2].setDates();
		}
	}
	
	$scope.readAndStore = function(c1,c2) {
		_update.show($scope,'update',$scope.pairs[c1][c2].readAndStore());
	};
};

ReadAndStoreCtrl.$inject = ['$scope','pairObjFactory','_update'];

app.controller('readAndStoreCtrl',ReadAndStoreCtrl);