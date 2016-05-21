'use strict';

var app = angular.module('forex.graph', ['ngRoute','routeStyles','angularChart'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/graph', {
    templateUrl: '/partials/graph',
    controller: 'GraphCtrl',
	css: '/stylesheets/graph.css'
  });
}]);

var GraphCtrl = function($scope,$timeout,dbHandler) {
	var _this = this;
	$scope.pairs = ['eurusd','gbpaud'];
	$scope.months = [];
	$scope.sdays = [];
	$scope.edays = [];
	$scope.years = [];
	
	$scope.getDaysInMonth = function(month, year) {
		return _this.getDaysInMonth(month, year);
	};
	
	$scope.deleteObjectKeys = function(obj,keysToDelete) {
		return _this.deleteObjectKeys(obj,keysToDelete);
	};
	
	$scope.setGraphOptions = function(graphData) {
		return _this.setGraphOptions(graphData);
	};
	
	$scope.splitMongoDate = function(mongoDate) {
		return _this.splitMongoDate(mongoDate);
	};
	
	for (var i=1; i<13; i++) $scope.months.push(i);
	for (var k=1990; k<2017; k++) $scope.years.push(k);

	$scope.pair = $scope.pairs[0];
	$scope.smonth = $scope.months[0];
	$scope.emonth = $scope.months[0];
	$scope.syear = $scope.years[0];
	$scope.eyear = $scope.years[1];
	$scope.sdays = $scope.getDaysInMonth($scope.smonth,$scope.syear);
	$scope.edays = $scope.getDaysInMonth($scope.emonth,$scope.eyear);
	$scope.sday = $scope.sdays[0];
	$scope.eday = $scope.edays[0];
	
	$scope.updateGraph = function() {
	
		var urlArray = [$scope.pair, 
						$scope.syear, $scope.smonth, $scope.sday,
						$scope.eyear, $scope.emonth, $scope.eday ];
		
		dbHandler.read(urlArray).then(function(response) {

			$scope.options = $scope.setGraphOptions([]);
			
			for (var i in response.data) {
				var datum = $scope.deleteObjectKeys(response.data[i],['open','high','low','__v','openinterest','volume']);
				datum.date = $scope.splitMongoDate(datum.date).ymd;
				$scope.options.data.push(datum);
			}
			/*
			Promise.resolve($scope.instance).then(function(chart) {
				console.log('resolving promise');
				console.log(chart);
				$scope.instance = chart;
			});
			*/
		});
	}
	
	//prevent updating graph before DOM is loaded
	$timeout(function() {
		$scope.updateGraph();
	},1);
}

GraphCtrl.prototype.getDaysInMonth = function(month,year) {
	var max_days = [31,28,31,30,31,30,31,31,30,31,30,31];
	if (!(year%4)) max_days[1]=29;
		
	var days_in_month = [];		
	for (var i=1; i<max_days[month-1]+1; i++) days_in_month.push(i);
		
	return days_in_month;
};

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
				}
	};
};

GraphCtrl.prototype.splitMongoDate = function(mongoDate) {
	var arr = mongoDate.split("T");
	var ymd_arr = arr[0].split("-");
	var hms_arr = arr[1].split(":");
	var obj = {};
	obj.ymd = arr[0];
	obj.hms = arr[1];
	obj.year = ymd_arr[0];
	obj.month = ymd_arr[1];
	obj.day = ymd_arr[2];
	obj.hour = hms_arr[0];
	obj.minute = hms_arr[1];
	obj.second = hms_arr[2];
	obj.ms = hms_arr[3];
		
	return obj;	
};	

GraphCtrl.$inject = ['$scope','$timeout','dbHandler'];

app.controller('GraphCtrl',GraphCtrl);