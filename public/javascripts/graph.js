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
	$scope.start = {};
	$scope.end = {};

	$scope.deleteObjectKeys = function(obj,keysToDelete) {
		return _this.deleteObjectKeys(obj,keysToDelete);
	};
	
	$scope.updateGraph = function() {
		var urlArray = [$scope.pair, 
						$scope.syear, $scope.smonth, $scope.sday,
						$scope.eyear, $scope.emonth, $scope.eday ];
		
		console.log(urlArray);
		
		dbHandler.read(urlArray).then(function(response) {
			console.log(response);
			$scope.ohlc = [];
			for (var i in response.data) {
				//var datum = $scope.deleteObjectKeys(response.data[i],['__v','openinterest','volume']);
				//datum.date = (new Date(datum.date)).getTime();
				var datum = [];
				datum[0] = new Date(response.data[i].date);
				datum[1] = response.data[i].open;
				datum[2] = response.data[i].high;
				datum[3] = response.data[i].low;
				datum[4] = response.data[i].close;
				
				$scope.ohlc.push(datum);
			}
		}).finally(function() {
			console.log($scope.ohlc);
			var title = $scope.pair+' '+[$scope.syear,$scope.smonth,$scope.sday].join('/')+'-'+[$scope.eyear,$scope.emonth,$scope.eday].join('/');
			var groupingUnits = [	['week',[1]],
									['month',[1,2,3,4,6]]];
			$scope.chartData = {
                   minTickInterval:5,
					title: {
                        text: title,
                    },
                    xAxis: {
                        tickInterval:5,
						title:'date'
                    },
					yAxis: {
						title:'exchange rate'
					},
                    series: [{
                        data: $scope.ohlc,
						name: $scope.pair,
						type: 'candlestick',
						dataGrouping: { units: groupingUnits },
                    }],
            };
		});
	}
				
	$scope.$watch('dbStartDateObj',function(newValue,oldValue) {
		if (typeof newValue != 'undefined') $scope.updateDates();
	});
	
	$scope.updateDates = function() {
		
		console.log($scope);
		
		$scope.smonth = $scope.dbStartDateObj.getMonth()+1;
		$scope.sday   = $scope.dbStartDateObj.getDate();
		$scope.syear  = $scope.dbStartDateObj.getFullYear();
							
		$scope.emonth = $scope.dbEndDateObj.getMonth()+1;
		$scope.eday   = $scope.dbEndDateObj.getDate();
		$scope.eyear  = $scope.dbEndDateObj.getFullYear();
		
		$scope.start.setMinDate($scope.dbStartDateObj).finally(function() {
			$scope.start.setMaxDate($scope.dbEndDateObj).finally(function() {
				$scope.end.setMinDate($scope.dbStartDateObj).finally(function() {
					$scope.end.setMaxDate($scope.dbEndDateObj).finally(function() {
						var endDateObj = $scope.dbStartDateObj;
						endDateObj.setFullYear($scope.dbStartDateObj.getFullYear()+1);
						$scope.end.setDate(endDateObj).then(function() {
							$scope.updateGraph();
						});
					});
				});
			});
		});
		
	};
}

GraphCtrl.prototype.deleteObjectKeys = function(obj,keysToDelete) {
	for (var i in keysToDelete) 
	{	
		delete obj[keysToDelete[i]];
	}
	return obj;
}

GraphCtrl.$inject = ['$injector','$scope','$rootScope','$timeout','dbHandler','splitMongoDate'];

app.controller('GraphCtrl',GraphCtrl);