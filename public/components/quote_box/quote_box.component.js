(function() {
	'use strict';
	
	var quoteBoxController = function(dbHandler,$filter,$scope) {
		var vm = this;
		vm.quote = null;	
		vm.currencies = ['aud','cad','chf','eur','gbp','jpy','nzd','usd'];
		vm.pairs = [];
	
		vm.updateQuote = function() {
			if (typeof vm.instrument !== 'undefined') {
				dbHandler.getLast(vm.instrument).then(function(response) {
					console.log(response);
					vm.quote = response.data;
					vm.quote.date = $filter("date")(vm.quote.date,"yyyy/MM/dd");
					vm.quote.open = $filter("number")(vm.quote.open,4);
					vm.quote.high = $filter("number")(vm.quote.high,4);
					vm.quote.low = $filter("number")(vm.quote.low,4);
					vm.quote.close = $filter("number")(vm.quote.close,4);
					vm.quote.volume = $filter("number")(vm.quote.volume,0);
				});
			}
		};
		
		vm.$onInit = function() {
			for (var i=0; i<vm.currencies.length; i++) {
				for (var j=0; j<vm.currencies.length; j++) {
					if (i !== j) {
						vm.pairs.push(vm.currencies[i]+vm.currencies[j]);
					}
				}
			}
			vm.updateQuote();
		};
		
		$scope.$watch(function(scope) { 
				return vm.instrument;
			}, function(newValue,oldValue) {
				console.log('newValue',newValue,'oldValue',oldValue);
				if (typeof newValue !== 'undefined') {
					console.log('vm.instrument changed: ',vm.instrument);
					vm.updateQuote();
				}
			});
	};
	
	angular.module('forex.components').component('quoteBox', {
		bindings: {
			instrument: '@',
		},
		controller: quoteBoxController,
		templateUrl: "./components/quote_box/quote_box.html",
	});
	
	//quoteBoxController.$inject(['dbHandler','$scope']);
})();