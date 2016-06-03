'use strict';

var app = angular.module('forex.graph', ['ngRoute','routeStyles'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/graph', {
    templateUrl: '/partials/graph',
    controller: 'GraphCtrl',
	css: '/stylesheets/graph.css'
  });
}]);

var GraphCtrl = function($scope) {
	var _this = this;
	$scope.start = {};
	$scope.end = {};
	$scope.graphControl = {};
	
	$scope.updateGraph = function() {
		var urlArray = [$scope.pair, 
						$scope.syear, $scope.smonth, $scope.sday,
						$scope.eyear, $scope.emonth, $scope.eday ];
		
		//calls function to redraw chart in highchart directive
		$scope.graphControl.updateChartData(urlArray);
	}
	
	//updates absolute start and end dates based on available data
	$scope.updateDates = function() {
		console.log($scope);
		
		$scope.smonth = $scope.dbStartDateObj.getMonth()+1;
		$scope.sday   = $scope.dbStartDateObj.getDate();
		$scope.syear  = $scope.dbStartDateObj.getFullYear();
							
		$scope.emonth = $scope.dbEndDateObj.getMonth()+1;
		$scope.eday   = $scope.dbEndDateObj.getDate();
		$scope.eyear  = $scope.dbEndDateObj.getFullYear();
		
		//prevent user from selecting date earlier than absolute start date or later than absolute end date
		$scope.start.setMinDate($scope.dbStartDateObj).finally(function() {
			$scope.start.setMaxDate($scope.dbEndDateObj).finally(function() {
				$scope.end.setMinDate($scope.dbStartDateObj).finally(function() {
					$scope.end.setMaxDate($scope.dbEndDateObj).finally(function() {
						//var startDateObj = $scope.dbEndDateObj;
						
						//initially graph displays past 1 year of data
						//startDateObj.setFullYear($scope.dbEndDateObj.getFullYear()-1);
						//$scope.start.setDate(startDateObj).then(function() {
							$scope.updateGraph();
						//});
					});
				});
			});
		});
	};
	
	$scope.$watch('dbStartDateObj',function(newValue,oldValue) {
		if (typeof newValue != 'undefined') $scope.updateDates();
	});
}

GraphCtrl.$inject = ['$scope'];

app.controller('GraphCtrl',GraphCtrl);