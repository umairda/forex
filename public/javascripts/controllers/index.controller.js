(function() {
	"use strict";
	
	var app = angular.module('forex.controllers');
	
	var IndexController = function(Page,$scope) {
		var vm = this;
		vm.page = Page;
				
		vm.pair="audcad";
		vm.period=60;
		vm.currencies = ['aud','cad','chf','eur','gbp','jpy','nzd','usd'];
		
		vm.updateTitle = function() {
			vm.page.setTitle("Forex Performance Over Past "+vm.period+" Days");
		};
				
		$scope.$watch(function(scope) { return vm.period; }, function() {
			vm.updateTitle();
		});
		
		vm.updateTitle();
	};

	IndexController.$inject = ['Page','$scope'];

	app.controller('IndexController',IndexController);
})();