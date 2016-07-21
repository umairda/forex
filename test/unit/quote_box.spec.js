(function() {

	'use strict';

	describe('quote_box component',function() {
	
		var $q,$scope;
		var element, quoteBoxCtrl = 0;
		
		beforeEach(module('forex'));
		beforeEach(module('my.templates'));
		beforeEach(module(function($provide) {			
			$provide.service('dbHandler',function() {
				var username = 'test username';
				this.getLast = function(instrument) {
					return $q.when({
						data: {
							instrument: instrument,
							date: '2000-01-02',
							open: 1.2345678,
							high: 2.2345678,
							low: 0.12345678,
							close: 1.35791113,
							volume: 1000111000
						}
					});
				};
			});
		}));
		beforeEach(inject(function($compile,_$q_,$rootScope) {
			$q = _$q_;
			$scope = $rootScope.$new();
			
			element = angular.element('<quote-box instrument="eurusd"></quote-box>');
			element = $compile(element)($scope);
			$scope.$apply();
			quoteBoxCtrl = element.controller('quoteBox');	
			//console.log(element);
		}));
	
		it("'s controller should be defined",function() {
			expect(quoteBoxCtrl).toBeDefined();
			expect(quoteBoxCtrl).not.toBe(0);
		});	
		
		it("should initiate the pairs array",function() {
			expect(quoteBoxCtrl.pairs.length).toBe(quoteBoxCtrl.currencies.length*(quoteBoxCtrl.currencies.length-1));
		});
		
		it("should set the button text",function() {
			var findButton = angular.element(element[0].querySelector('button')).text().trim();
			expect(findButton.search("eurusd")).not.toBe(-1);
		});
		
		it("should set the options in the drop down menu",function() {
			var findLi = element[0].querySelectorAll('li');
			expect(findLi.length).toBe(quoteBoxCtrl.pairs.length);
		});
		
		it("should set the key,value bindings according to quoteBoxCtrl.quote",function() {
			var findTd = element[0].querySelectorAll('td');
			for (var i=0; i<Object.keys(quoteBoxCtrl.quote).length; i++) {
				var keyTd = findTd[2*i];
				var keyTdClass = keyTd.getAttribute('class');
				expect(keyTdClass.search(Object.keys(quoteBoxCtrl.quote)[i])).not.toBe(-1);
				var keyTdValue = angular.element(keyTd).text().trim();
				expect(keyTdValue).toBe(Object.keys(quoteBoxCtrl.quote)[i]);
				
				var valueTd = findTd[2*i+1];
				var valueTdClass = valueTd.getAttribute('class');
				expect(valueTdClass.search(Object.keys(quoteBoxCtrl.quote)[i])).not.toBe(-1);
				var valueTdValue = angular.element(valueTd).text().trim();
				expect(valueTdValue).toBe(quoteBoxCtrl.quote[Object.keys(quoteBoxCtrl.quote)[i]]);
			}
		});
		
		it("should watch the instrument value and update the bindings if it changes", function() {
			var findButton = angular.element(element[0].querySelector('button')).text().trim();
			expect(findButton.search("eurusd")).not.toBe(-1);
			quoteBoxCtrl.instrument = "audcad";
			$scope.$apply();
			var findButton = angular.element(element[0].querySelector('button')).text().trim();
			expect(findButton.search("audcad")).not.toBe(-1);
		});
	});
}());