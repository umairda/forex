'use strict'

var app = angular.module('forex.table', ['ngRoute','routeStyles'])

.config(['$routeProvider',function($routeProvider) {
	$routeProvider.when('/table', {
		templateUrl: '/partials/table',
		controller: 'TableCtrl',
		css: '/stylesheets/table.css'
	});
}]);

var TableCtrl = function($scope, $rootScope, dbHandler, pairObjFactory) {
	$scope.currencies = ['aud','cad','chf','eur','gbp','jpy','nzd','usd'];
	$scope.pairs = [];
	$scope.period = 60;
	
	for (var i=0; i<$scope.currencies.length; i++) {
		var _c1 = $scope.currencies[i];
		$scope.pairs[_c1] = [];
		for (var j=0; j<$scope.currencies.length; j++) {
			var _c2 = $scope.currencies[j];
			$scope.pairs[_c1][_c2]=new pairObjFactory.pairObj(_c1,_c2,$scope.period);
			$scope.pairs[_c1][_c2].setDifference();
		}
	}
	console.log($scope.pairs);
	
	$scope.findGreatest = function() {
		var greatestC1 = 0, greatestC2 = 0;
		var leastC1 = 0, leastC2 = 0;
		var greatestVsC1 = 0, greatestVsC2 = 0;
		var leastVsC1 = 0, leastVsC2 = 0;

		for (var i=0; i<$scope.currencies.length; i++) {
			var c1 = $scope.currencies[i];
			greatestVsC1 = 0;
			leastVsC1 = 0;
			for (var j=0; j<$scope.currencies.length; j++) {
				var c2 = $scope.currencies[j];
				if (c1 != c2) {
					if (!greatestC1 && !greatestC2) {
						greatestC1 = c1;
						greatestC2 = c2;
					}
					if (!leastC1 && !leastC2) {
						leastC1 = c1;
						leastC2 = c2;
					}
					if (!greatestVsC1) greatestVsC1 = c2;
					if (!leastVsC1) leastVsC1 = c2;
					
					var currentDifference = +$scope.pairs[c1][c2].difference; 
					var greatestDifferenceSoFar = +$scope.pairs[greatestC1][greatestC2].difference;
					var leastDifferenceSoFar = +$scope.pairs[leastC1][leastC2].difference;
					var greatestDifferenceVsC1SoFar = +$scope.pairs[c1][greatestVsC1].difference;
					var leastDifferenceVsC1SoFar = +$scope.pairs[c1][leastVsC1].difference;
						
					if ((j>=i) && (currentDifference>greatestDifferenceSoFar)) {
						greatestC1 = c1;
						greatestC2 = c2;
					}
					else $scope.pairs[c1][c2].greatest=0;
					
					if ((j>=i) && (currentDifference<leastDifferenceSoFar)) {
						leastC1 = c1;
						leastC2 = c2;
					}
					else $scope.pairs[c1][c2].least=0;
					
					if (currentDifference>greatestDifferenceVsC1SoFar) {
						greatestVsC1 = c2;
					}
					else $scope.pairs[c1][c2].greatestVsC1=0;
					
					if (currentDifference<leastDifferenceVsC1SoFar) {
						leastVsC1 = c2;
					}
					else $scope.pairs[c1][c2].leastVsC1=0;
				}
			}
			if (greatestVsC1) $scope.pairs[c1][greatestVsC1].greatestVsC1=1;
			if (leastVsC1) $scope.pairs[c1][leastVsC1].leastVsC1=1;
		}
		console.log(greatestC1,greatestC2);
		$scope.pairs[greatestC1][greatestC2].greatest=1;
		$scope.pairs[leastC1][leastC2].least=1;
	};
	
	$scope.update = function() {
		for (var i=0; i<$scope.currencies.length; i++) {
			var c1 = $scope.currencies[i];
			for (var j=0; j<$scope.currencies.length; j++) {
				var c2 = $scope.currencies[j];
				if (c1!=c2) {
					pairs[c1][c2].period = $scope.period;
					pairs[c1][c2].setDifference();
				}
			}
		}
	};
	
	$rootScope.$on('loading:progress', function (){
    // show loading gif
		console.log("loading:progress");
	});

	$rootScope.$on('loading:finish', function (){
		console.log("loading:finish");
		$scope.findGreatest();
	});
	
};

TableCtrl.$inject = ['$scope','$rootScope','dbHandler','pairObjFactory'];

app.controller('TableCtrl',TableCtrl);