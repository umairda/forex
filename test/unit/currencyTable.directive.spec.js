(function() {

	'use strict';

	describe('currencyTable',function() {
	
		var $compile,$q,$scope;
		var element, currencyTableCtrl = 0;
		
		beforeEach(module('forex'));
		beforeEach(module('my.templates'));
		beforeEach(module(function($provide) {			
			$provide.service('Pair',function() {
				var obj = function(c1,c2,period) {
					var vm = this;
					vm.c1 = c1;
					vm.c2 = c2;
					vm.difference = 0;
					vm.least = 0;
					vm.leastVsC1 = 0;
					vm.greatest = 0;
					vm.greatestVsC1 = 0;
					vm.period = period;
					vm.setDifferenceCalled = 0;
					vm.setDifference = function() {
						return $q.when(true).then(function() {
							return ++vm.setDifferenceCalled;
						});
					};
				};
				return {
					obj: obj,
				};
			});
		}));
		beforeEach(inject(function(_$compile_,_$q_,$rootScope) {
			$compile = _$compile_;
			$q = _$q_;
			$scope = $rootScope.$new();
			
			element = angular.element('<currency-table currencies="currencies" period="period" selected="selected"></currency-table>');
			$scope.currencies = ['aud','cad','eur'];
			$scope.period = 60;
			$scope.selected = 'cadeur';
			element = $compile(element)($scope);
			$scope.$apply();
			currencyTableCtrl = element.controller('currencyTable');	
			//console.log(element);
		}));
		
		it("'s controller should be defined",function() {			
			expect(currencyTableCtrl).toBeDefined();
			expect(currencyTableCtrl).not.toBe(0);
		
		});	
		
		it("should fill the table by initializing the pairs array", function() {			
			var findTd = element[0].querySelectorAll('td[title]');
			expect(findTd.length).toBe($scope.currencies.length*$scope.currencies.length);
		});
		
		it("should set the difference for all elements", function() {
			var findTd = element[0].querySelectorAll('td[title]');
			for (var i=0; i<$scope.currencies.length; i++) {
				for (var j=0; j<$scope.currencies.length; j++) {
					var c1 = $scope.currencies[i];
					var c2 = $scope.currencies[j];
					if (i !== j) {
						expect(currencyTableCtrl.pairs[c1][c2].setDifferenceCalled).toBe(1);
					} 
					else {
						expect(currencyTableCtrl.pairs[c1][c2]).toBeUndefined();
					}
				}
			}
		});
		
		it("should set the greatest, least, and VsC1 variables for the currency pairs",function() {
			for (var i=0; i<$scope.currencies.length; i++) {
				for (var j=0; j<$scope.currencies.length; j++) {
					if (i !== j) {
						var c1 = $scope.currencies[i];
						var c2 = $scope.currencies[j];
						currencyTableCtrl.pairs[c1][c2].difference=i+2*j;
					}
				}
			}
			currencyTableCtrl.findGreatest();
			for (var i=0; i<$scope.currencies.length; i++) {
				for (var j=0; j<$scope.currencies.length; j++) {
					if (i !== j) {
						var c1 = $scope.currencies[i];
						var c2 = $scope.currencies[j];
						//console.log(i,j,currencyTableCtrl.pairs[c1][c2].difference,currencyTableCtrl.pairs[c1][c2].greatestVsC1);
						if (i === 1 && j === 2) {
							expect(currencyTableCtrl.pairs[c1][c2].greatest).toBe(1);
						}
						else {
							expect(currencyTableCtrl.pairs[c1][c2].greatest).toBe(0);
						}
						if (i === 0 && j === 1) {
							expect(currencyTableCtrl.pairs[c1][c2].least).toBe(1);
						}
						else {
							expect(currencyTableCtrl.pairs[c1][c2].least).toBe(0);
						}
						if ((i === 0 && j === 2) || (i === 1 && j === 2) || (i === 2 && j === 1))						
						{
							expect(currencyTableCtrl.pairs[c1][c2].greatestVsC1).toBe(1);
							expect(currencyTableCtrl.pairs[c1][c2].leastVsC1).toBe(0);
						}
						else {
							expect(currencyTableCtrl.pairs[c1][c2].greatestVsC1).toBe(0);
							expect(currencyTableCtrl.pairs[c1][c2].leastVsC1).toBe(1);
						}
						
					}
				}
			}
		});	

		it("should keep track of the selected currency pair",function() {
			var init = $scope.selected;
			expect(currencyTableCtrl.selected).toBe($scope.selected);
			currencyTableCtrl.select('eur','usd');
			expect(currencyTableCtrl.selected).toBe('eurusd');
			expect(currencyTableCtrl.selected).not.toBe(init);
		});
		
		it("should watch the period binding and update on change", function() {
			spyOn(currencyTableCtrl,'update');
			var init = $scope.period;
			expect(currencyTableCtrl.period).toBe($scope.period);
			$scope.period = 90;
			$scope.$apply();
			expect(currencyTableCtrl.update).toHaveBeenCalled();
			expect(currencyTableCtrl.period).not.toBe(init);
		});
		
		it("should watch the currencies array and update on change", function() {
			spyOn(currencyTableCtrl,'update');
			var init = $scope.currencies.slice(0,$scope.currencies.length);
			expect(currencyTableCtrl.currencies).toEqual(init);
			$scope.currencies.push('jpy');
			$scope.$apply();
			expect(currencyTableCtrl.update).toHaveBeenCalled();
			expect(currencyTableCtrl.currencies).not.toEqual(init);
		    init = $scope.currencies;
			$scope.currencies = ['jpy'];
			$scope.$apply();
			expect(currencyTableCtrl.update).toHaveBeenCalled();
			expect(currencyTableCtrl.currencies).not.toEqual(init);
		});
	});
}());