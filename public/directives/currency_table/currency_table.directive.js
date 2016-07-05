(function() {
	'use strict';
	
	var currencyTableController = function(dbHandler,Pair,$q,$scope) {
		var vm = this;
		vm.pairs = [];
		//vm.period = 60;
		
		vm.fillTable = function() {
			var complete=0;
			return $q(function(resolve,reject) {
				if (vm.currencies) {
					var isComplete = function() {
						complete++;
						if (complete>(vm.currencies.length*(vm.currencies.length-1)-1)) 
						{
							resolve(complete);
						}
					};
					for (var i=0; i<vm.currencies.length; i++) {
						var c1 = vm.currencies[i];
						//if (typeof vm.pairs[c1] === 'undefined') 
						vm.pairs[c1]=[];
						for (var j=0; j<vm.currencies.length; j++) {
							var c2 = vm.currencies[j];
							//if (typeof vm.pairs[c1][c2] === 'undefined') 
							vm.pairs[c1][c2]=new Pair.obj(c1,c2,vm.period);
							if (c1!==c2) {
								vm.pairs[c1][c2].period = vm.period;							
								vm.pairs[c1][c2].setDifference().finally(isComplete);
							}
						}
					}
				}
				else {
					reject(complete);
				}
			});
		};
		
		vm.findGreatest = function() {
			var greatestC1 = 0, greatestC2 = 0;
			var leastC1 = 0, leastC2 = 0;
			var greatestVsC1 = 0, greatestVsC2 = 0;
			var leastVsC1 = 0, leastVsC2 = 0;

			for (var i=0; i<vm.currencies.length; i++) {
				var c1 = vm.currencies[i];
				greatestVsC1 = 0;
				leastVsC1 = 0;

				for (var j=0; j<vm.currencies.length; j++) {
					var c2 = vm.currencies[j];
					if (c1 !== c2) {
						if (!greatestC1 && !greatestC2) {
							greatestC1 = c1;
							greatestC2 = c2;
						}
						if (!leastC1 && !leastC2) {
							leastC1 = c1;
							leastC2 = c2;
						}
						if (!greatestVsC1) { greatestVsC1 = c2; }
						if (!leastVsC1) { leastVsC1 = c2; }
						
						var currentDifference = +vm.pairs[c1][c2].difference; 
						var greatestDifferenceSoFar = +vm.pairs[greatestC1][greatestC2].difference;
						var leastDifferenceSoFar = +vm.pairs[leastC1][leastC2].difference;
						var greatestDifferenceVsC1SoFar = +vm.pairs[c1][greatestVsC1].difference;
						var leastDifferenceVsC1SoFar = +vm.pairs[c1][leastVsC1].difference;
						/*console.log(currentDifference,greatestDifferenceSoFar,
									leastDifferenceSoFar,greatestDifferenceVsC1SoFar,
									leastDifferenceVsC1SoFar);*/
						
						if ((j>=i) && (currentDifference>greatestDifferenceSoFar)) {
							greatestC1 = c1;
							greatestC2 = c2;
						}
						else { vm.pairs[c1][c2].greatest=0; }
						
						if ((j>=i) && (currentDifference<leastDifferenceSoFar)) {
							leastC1 = c1;
							leastC2 = c2;
						}
						else { vm.pairs[c1][c2].least=0; }
						
						if (currentDifference>greatestDifferenceVsC1SoFar) {
							greatestVsC1 = c2;
						}
						else { vm.pairs[c1][c2].greatestVsC1=0; }
						
						if (currentDifference<leastDifferenceVsC1SoFar) {
							leastVsC1 = c2;
						}
						else { vm.pairs[c1][c2].leastVsC1=0; }
					}
				}
				if (greatestVsC1) { vm.pairs[c1][greatestVsC1].greatestVsC1=1; }
				if (leastVsC1) { vm.pairs[c1][leastVsC1].leastVsC1=1; }
			}
			vm.pairs[greatestC1][greatestC2].greatest=1;
			vm.pairs[leastC1][leastC2].least=1;
		};
		
		vm.select = function(c1,c2) {
			if (c1 !== c2) {
				vm.selected=c1+c2;
			}
		};
		
		vm.update = function() {
			vm.fillTable().then(function(tableSize) {
					vm.findGreatest();
				},function(tableSize) {
					console.log("currencies not set");
				});
		};
				
		vm.$onInit = vm.update;
		
		$scope.$watch(function(scope) { return vm.period; }, function(value) {
			if (angular.isNumber(+value) && (value>0)) {
				vm.update();
			}
		});
		$scope.$watch(function(scope) { return vm.currencies; }, vm.update);
	};
	
	angular.module('forex.directives').directive('currencyTable', function(dbHandler) {
		return {
			restrict: 'E',
			templateUrl: '/directives/currency_table/currency_table.html',
			controller: currencyTableController,
			controllerAs: 'ctrl',
			scope: {
				currencies: "=currencies",
				period: "=period",
				selected: "=selected",
			},
			bindToController: true,
			transclude: true,
			replace: true,
		};
	});
})();