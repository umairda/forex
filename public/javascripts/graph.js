'use strict';

var max_days = [31,28,31,30,31,30,31,31,30,31,30,31];

function update_days_in_month() {
	$('#sday option').removeAttr('disabled');
	var md = max_days[$("#smonth option:selected").text()-1];

	$('#sday option:gt('+(md-1)+')').each(function() {
		$(this).attr('disabled','disabled');
	});
}

function update_max_days() {
	var year = $('#syear option:selected').text();
	
	if (!(year%4)) max_days[1]=29;
	else max_days[1] = 28;
	update_days_in_month();
}

angular.module('forex.graph', ['ngRoute','routeStyles','angularChart'])

.config(['$routeProvider', function($routeProvider) {
  var temp = $routeProvider['$get'];
  $routeProvider.when('/graph', {
    templateUrl: '/partials/graph',
    controller: 'GraphCtrl',
	css: '/stylesheets/graph.css'
  });
}])

.controller('GraphCtrl', function($scope) {
	$scope.pairs = ['eurusd','gbpaud'];
	$scope.months = [];
	$scope.days = [];
	$scope.years = [];
	for (var i=1; i<13; i++) $scope.months.push(i);
	for (var j=1; j<32; j++) $scope.days.push(j); 
	for (var k=0; k<17; k++) $scope.years.push(2000+k);
	
	update_days_in_month();
	update_max_days();
	
	$("#smonth").change(update_days_in_month);
	$("#syear").change(update_max_days);
	
    $scope.options = {
      data: [
        {sales: 130, income: 250},
		{sales: 150, income: 150},
		{sales: 180, income: 200},
		{sales: 210, income: 250},
      ],
      dimensions: {
        sales: {
		  axis: 'x',
          type: 'line'
        },
        income: {
          axis: 'y2'
        }
      }
    };
    
    // optional (direct access to c3js API http://c3js.org/reference.html#api)
    $scope.instance = null;
});
/*
.run(['$rootScope', function($rootScope) {
	$rootScope.$on('$routeChangeStart', function(event, next, current) {
		var currentPath = current.originalPath;
		var nextPath = next.originalPath;
		alert(currentPath);
		alert(nextPath);
		console.log('Starting to leave %s to go to %s', currentPath, nextPath);
		});
	}
]);
*/