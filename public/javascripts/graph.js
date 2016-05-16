'use strict';

angular.module('forex.graph', ['ngRoute','routeStyles','angularChart'])

.config(['$routeProvider', function($routeProvider) {
  var temp = $routeProvider['$get'];
  $routeProvider.when('/graph', {
    templateUrl: '/partials/graph',
    controller: 'GraphCtrl',
	css: '/stylesheets/graph.css'
  });
}])

.controller('GraphCtrl', function($scope, $http) {
	$scope.pairs = ['eurusd','gbpaud'];
	$scope.months = [];
	$scope.sdays = [];
	$scope.edays = [];
	$scope.years = [];
	
	$scope.get_days_in_month = function(month, year) {
		var max_days = [31,28,31,30,31,30,31,31,30,31,30,31];
		if (!(year%4)) max_days[1]=29;
		
		var days_in_month = [];		
		for (var i=1; i<max_days[month-1]+1; i++) days_in_month.push(i);
		
		return days_in_month;
	}
	
	$scope.update_sdays = function() {
		$scope.sdays = $scope.get_days_in_month($scope.smonth,$scope.syear);
	};
	
	$scope.update_edays = function() {
		$scope.edays = $scope.get_days_in_month($scope.emonth,$scope.eyear);
	};
	
	for (var i=1; i<13; i++) $scope.months.push(i);
	for (var k=0; k<17; k++) $scope.years.push(1993+k);

	$scope.pair = $scope.pairs[0];
	$scope.smonth = $scope.months[0];
	$scope.emonth = $scope.months[0];
	$scope.syear = $scope.years[0];
	$scope.eyear = $scope.years[1];
	$scope.sdays = $scope.get_days_in_month($scope.smonth, $scope.syear);
	$scope.edays = $scope.get_days_in_month($scope.emonth, $scope.eyear);
	$scope.sday = $scope.sdays[0];
	$scope.eday = $scope.edays[0];	
		
	$scope.strip = function(obj,delete_arr) {
		for (var i in delete_arr) 
		{	
			delete obj[delete_arr[i]];
			//alert("stripped "+delete_arr[i]+" "+JSON.stringify(obj));
		}
		return obj;
	};
		
	$scope.split_mongo_date = function(mongo_date) {
		var arr = mongo_date.split("T");
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
	
	$scope.options = {
		data: [{"date":"1993-01-01","close":"2.776"},{"date":"1993-01-02","close":"2.736"}],
		dimensions: {
						"date": {
							axis: 'x',
							type: 'line'
						},
						"close": {
							axis: 'y2'
						}
					}
	};
	
	$scope.instance = null;	
	
	$scope.update_graph = function () {
	
		var url = [	$scope.pair, 
					$scope.syear, $scope.smonth, $scope.sday,
					$scope.eyear, $scope.emonth, $scope.eday ];
		
		$http.get("/readfromdb/"+url.join('/')).then(function(response) {
			
			$scope.options.data = [];
			for (var i in response.data) {
				var data = $scope.strip(response.data[i],['open','high','low','__v','openinterest','volume']);
				data.date = $scope.split_mongo_date(data.date).ymd;
				//alert(JSON.stringify(data));
				$scope.options.data.push(data);
				//alert(JSON.stringify($scope.options.data));
			}
			//alert(JSON.stringify($scope.options.data));
			var cache = [];
			var temp = JSON.stringify($scope.instance, function(key, value) {
				if (typeof value === 'object' && value !== null) {
					if (cache.indexOf(value) !== -1) {
						// Circular reference found, discard key
						return;
					}
					// Store value in our collection
					cache.push(value);
				}
				return value;
			});
			cache = null;
			//alert("scope.instance="+temp);
		
		});
	}
	$scope.$watch("$scope.options", function(newValue,oldValue) {
		console.log("$scope.options:",newValue);
	});
	
	$scope.update_graph();
    
    // optional (direct access to c3js API http://c3js.org/reference.html#api)

});