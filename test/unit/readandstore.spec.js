(function() {

	'use strict';

	describe('readAndStoreController', function() {
		var httpBackend = null,$scope;
		var page = null;
		var ctrl = null;
		var initPromise = null;
		var PairMock;
		
		beforeEach(module('forex'));
		beforeEach(inject(function($controller,$q,Page,Pair,$rootScope) {
			$scope = $rootScope.$new();
			page=Page;
					
			PairMock = {
					obj: function(_c1,_c2,_period) {
						var c1 = _c1;
						var c2 = _c2;
						var period = _period;
						this.isSetDatesCalled = false;
						this.isReadAndStoreCalled = false;
						this.setDates = function() { 
							this.isSetDatesCalled=true; 
							var deferred=$q.defer();
							deferred.resolve(this.isSetDatesCalled);
							return deferred.promise;
						};
						this.readAndStore = function() { 
							this.isReadAndStoreCalled=true; 
							var deferred=$q.defer();
							deferred.resolve('5 records added');
							return deferred.promise;
						};
					}
			};
			
			ctrl = $controller('readAndStoreController', {
				Page: Page,
				Pair: PairMock,
				$q: $q,
				$scope: $scope
			});
			initPromise = ctrl.init();		
		}));
		
		it('initializes an array of pair objects', function(done) {
			initPromise.then(function() {
				for (var i=0; i<ctrl.currencies.length; i++) {
					var c1 = ctrl.currencies[i];
					for (var j=0; j<ctrl.currencies.length; j++) {
						var c2 = ctrl.currencies[j];
						expect(ctrl.pairs[c1][c2]).toBeDefined();
						expect(ctrl.pairs[c1][c2].isSetDatesCalled).toBe(true);
						if ((i === ctrl.currencies.length-1) && (j === ctrl.currencies.length-1)) {
							done();
						}
					}
				}
			});
			$scope.$digest();
		});
		
		it('provides an update of new records read and stored', function(done) {
			var c1='eur', c2='usd';
			initPromise.then(function() {
				ctrl.readAndStore(c1,c2).finally(function() {
					expect(ctrl.pairs[c1][c2].isReadAndStoreCalled).toBe(true);
					expect(ctrl.update).not.toBe('');
					done();
				});
			});
			$scope.$digest();
		});
		
		it('sets the page title', function() {
			expect(page.title()).not.toBe('default');
			expect(page.title()).not.toBe('loading');
		});
	});
}());