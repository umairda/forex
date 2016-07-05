(function() {

	'use strict';

	var app = angular.module('forex.controllers')

	.config(['$routeProvider', function($routeProvider) {
	  $routeProvider.when('/graph', {
		templateUrl: '/partials/graph',
		controller: 'GraphController',
		css: '/stylesheets/graph.css'
	  });
	}]);

	var GraphController = function($scope,Page) {
		var vm = this;
		$scope.$watch(function watchPair(scope) {
			return vm.pair;
		},function(newValue,oldValue) {
			Page.setTitle('Graph of '+newValue);
			if (typeof newValue !== 'undefined') { vm.updateChartData(newValue); }
		});
	};

	GraphController.$inject = ['$scope','Page'];

	app.controller('GraphController',GraphController);

})();