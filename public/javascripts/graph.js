'use strict';

var app = angular.module('forex.graph', ['ngRoute','routeStyles','angularChart'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/graph', {
    templateUrl: '/partials/graph',
    controller: 'GraphCtrl',
	css: '/stylesheets/graph.css'
  });
}]);

var GraphCtrl = function($injector,$scope,$rootScope,$timeout,dbHandler,splitMongoDate) {
	var _this = this;

	$scope.deleteObjectKeys = function(obj,keysToDelete) {
		return _this.deleteObjectKeys(obj,keysToDelete);
	};
	
	$scope.setGraphOptions = function(graphData) {
		return _this.setGraphOptions(graphData);
	};
	
	$scope.updateGraph = function() {
		var urlArray = [$scope.pair, 
						$scope.syear, $scope.smonth, $scope.sday,
						$scope.eyear, $scope.emonth, $scope.eday ];
		
		console.log(urlArray);
		
		dbHandler.read(urlArray).then(function(response) {
			console.log(response);
			$scope.options = $scope.setGraphOptions([]);
			
			for (var i in response.data) {
				var datum = $scope.deleteObjectKeys(response.data[i],['open','high','low','__v','openinterest','volume']);
				datum.date = splitMongoDate(datum.date).ymd;
				$scope.options.data.push(datum);
			}
		});
	}
	
	$scope.$watch('dbStartDateObj',function(newValue,oldValue) {
		if (typeof newValue != 'undefined') $scope.updateDates();
	});
	
	$scope.updateDates = function() {
		$scope.smonth = $scope.dbStartDateObj.getMonth()+1;
		$scope.sday   = $scope.dbStartDateObj.getDate();
		$scope.syear  = $scope.dbStartDateObj.getFullYear();
							
		$scope.emonth = $scope.dbEndDateObj.getMonth()+1;
		$scope.eday   = $scope.dbEndDateObj.getDate();
		$scope.eyear  = $scope.dbEndDateObj.getFullYear();
	};

	var doOnce=0;
	
	$rootScope.$on('loading:finish', function (){
		console.log("loading:finish");
		
		if (!doOnce) {
			$scope.updateGraph();
			doOnce++;
		}
	});
}

GraphCtrl.prototype.deleteObjectKeys = function(obj,keysToDelete) {
	for (var i in keysToDelete) 
	{	
		delete obj[keysToDelete[i]];
	}
	return obj;
}

GraphCtrl.prototype.setGraphOptions = function(graphData) {
	return {
		data: graphData,
		dimensions: {
						"date": {
							axis: 'x',
							type: 'line'
						},
						"close": {
						axis: 'y'
						}
					},
		labels: [1993,1994,1995,1996,1997,1998,1999,2000],
	};
};

GraphCtrl.$inject = ['$injector','$scope','$rootScope','$timeout','dbHandler','splitMongoDate'];

app.controller('GraphCtrl',GraphCtrl);