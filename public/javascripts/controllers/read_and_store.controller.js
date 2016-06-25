(function() {
	'use strict';
	var app = angular.module('forex.readAndStore', ['ngRoute','ngSanitize','routeStyles'])

	.config(['$routeProvider',function($routeProvider) {
		$routeProvider.when('/readandstore', {
			templateUrl: '/partials/readandstore',
			controller: 'readAndStoreController',
			css: '/stylesheets/readandstore.css'
		});
	}]);

	var readAndStoreController = function(Page,pairObjFactory,$q,$scope) {
		Page.setTitle('Data file start and end dates');
		var vm = this;
		vm.currencies = ['aud','cad','chf','eur','gbp','jpy','nzd','usd'];
		vm.pairs = [];
		vm.update = '';
		
		vm.init = function() {
			/*var complete=0;
			//return $q(function(resolve,reject) {
				for (var i=0; i<vm.currencies.length; i++) {
					var c1 = vm.currencies[i];
					vm.pairs[c1] = [];
					for (var j=0; j<vm.currencies.length; j++) {
						var c2 = vm.currencies[j];
						vm.pairs[c1][c2]=new pairObjFactory.pairObj(c1,c2,0);
						console.log(c1,c2," setting dates");
						vm.pairs[c1][c2].setDates().then(function(param) {
							console.log(param," dates set");
							complete++;
							//if (complete>vm.currencies.length*vm.currencies.length-1) resolve(1);
						});
					}
				}
			//});
			*/
			var queue = [];
			for (var i=0; i<vm.currencies.length; i++) {
					var c1 = vm.currencies[i];
					vm.pairs[c1] = [];
					for (var j=0; j<vm.currencies.length; j++) {
						var c2 = vm.currencies[j];
						vm.pairs[c1][c2]=new pairObjFactory.pairObj(c1,c2,0);
						//console.log(c1,c2," setting dates");
						queue.push(vm.pairs[c1][c2].setDates());
					}
			}
			$q.all(queue).then(function() {
				console.log('complete');
			});
			
			
		};
		
		vm.readAndStore = function(c1,c2) {
			return vm.pairs[c1][c2].readAndStore().then(function(status) {
				vm.update="<div>"+c1+c2+': '+status+"</div>"+vm.update;
			});
		};
		
		vm.init();
	};

	readAndStoreController.$inject = ['Page','pairObjFactory','$q','$scope'];

	app.controller('readAndStoreController',readAndStoreController);

})();