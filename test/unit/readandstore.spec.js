'use strict'

describe('readAndStoreController', function() {
	var httpBackend = null,$scope;
	var page = null;
	var ctrl = null;
	var initPromise = null;
	var pairObjFactoryMock;
	
	beforeEach(module('forex'));
	beforeEach(inject(function($controller,$q,Page,pairObjFactory,$rootScope) {
		$scope = $rootScope.$new();
		page=Page;
/*		
		httpBackend.whenRoute('GET','/getDates/:pair')
				   .respond(function(method,url,data,headers,params) {
						return [200, {	
								"start":
									{	"instrument":params.pair,
										"date":"1993-05-11T00:00:00.000Z"},
								"end":
									{	"instrument":params.pair,
										"date":"2016-05-27T00:00:00.000Z"}
							
						}];
					});
*/					
		pairObjFactoryMock = {
			pairObj: function(_c1,_c2,_period) {
				return {
					c1:_c1,
					c2:_c2,
					period:_period,
					isSetDatesCalled:false,
					isReadAndStoreCalled:false,
					setDates:function() { 
						this.isSetDatesCalled=true; 
						var deferred=$q.defer();
						deferred.resolve(this.isSetDatesCalled);
						return deferred.promise;
					},
					readAndStore:function() { 
						this.isReadAndStoreCalled=true; 
						var deferred=$q.defer();
						deferred.resolve('5 records added');
						return deferred.promise;
					}
				}
			}
		}
		ctrl = $controller('readAndStoreController', {
			Page: Page,
			pairObjFactory: pairObjFactoryMock
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
				}
			}
			done();
		});
		$scope.$digest();
	});
	
	it('provides an update of new records read and stored', function(done) {
/*		httpBackend.whenRoute('GET','/readfromfile/:pair')
				   .respond(200,[{	"success":1,
									"data":[
										{
											"1":{"Date":"1993/05/11","Open":"1.2414","High":"1.2416","Low":"1.2376","Close":"1.2378","Volume":"0","OpenInterest":"0"},
											"2":{"Date":"1993/05/12","Open":"1.2378","High":"1.238","Low":"1.2353","Close":"1.2355","Volume":"0","OpenInterest":"0"}
										}]
								}]);	
*/		
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