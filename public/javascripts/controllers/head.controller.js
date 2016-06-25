(function() {
	
	'use strict';

	var app = angular.module('forex.head', []);

	var HeadController = function(Page,$rootScope) {
		var vm = this;
		vm.page = Page;
		vm.page.setTitle('loading');

		
		$rootScope.$on('loading:progress',function() {

		});
		
		$rootScope.$on('loading:finish',function() {

		});
	};

	HeadController.$inject = ['Page','$rootScope'];

	app.controller('HeadController',HeadController);

})();