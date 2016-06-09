'use strict';

var app = angular.module('forex.graph', ['ngRoute','routeStyles'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/graph', {
    templateUrl: '/partials/graph',
    controller: 'GraphController',
	css: '/stylesheets/graph.css'
  });
}]);

var GraphController = function($scope) {
	var vm = this;
	
	$scope.$watch(function watchPair(scope) {
		return vm.pair;
	},function(newValue,oldValue) {
		if (typeof newValue != 'undefined') vm.updateChartData(newValue);
	});
}

GraphController.$inject = ['$scope'];

app.controller('GraphController',GraphController);