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
	$scope.graphControl = {};
	
	$scope.$watch('pair',function(newValue,oldValue) {
		console.log('pair changed');
		if (typeof newValue != 'undefined') $scope.graphControl.updateChartData($scope.pair);
	});
}

GraphCtrl.$inject = ['$scope'];

app.controller('GraphCtrl',GraphCtrl);