'use strict'

describe('TableController', function() {
	var httpBackend = null, $scope = null;
	var ctrl = null, page = null;
	var fillTablePromise = null;
	
	beforeEach(module('forex'));
	beforeEach(inject(function($rootScope,$controller,$httpBackend,$q,Page,pairObjFactory) {
		httpBackend = $httpBackend;
		$scope = $rootScope.$new();
		page = Page;
		ctrl = $controller('TableController', {
			$q: $q,
			Page: Page,
			pairObjFactory: pairObjFactory
		});
		$httpBackend.whenRoute('GET','/getDifference/:pair/'+new Date()+'/60')
				.respond(function(method,url,data,headers,params) {
					return [200, {	
							"sdoc":	{
								"instrument":params.pair,
								"date":"2016-05-27T00:00:00.000Z",
								"open":1.119395,
								"high":1.12008,
								"low":1.111095,
								"close":1.11138,
								"openinterest":176662,
								"volume":176662},
							"edoc":	{
								"instrument":params.pair,
								"date":"2016-03-07T00:00:00.000Z",
								"open":1.09905,
								"high":1.1025851,
								"low":1.09401,
								"close":1.1014199,
								"openinterest":186049,
								"volume":186049},
							"pct_diff":"0.90"	}];
				});
		fillTablePromise = ctrl.fillTable();
	}));
	
	it('sets the page title', function() {
		expect(page.title()).not.toBe('default');
		expect(page.title()).not.toBe('loading');
	});
	
	it('fills the table with pair objects and initializes them - testing vm.fillTable()', function(done) {	
		fillTablePromise.then(function(success) {
			for (var i=0; i<ctrl.currencies.length; i++)
			{
				for (var j=0; j<ctrl.currencies.length; j++)
				{
					var c1 = ctrl.currencies[i], c2 = ctrl.currencies[j];
					if (c1===c2) expect(ctrl.pairs[c1][c2].difference).toBe('-');
					else expect(ctrl.pairs[c1][c2].difference).not.toBe('-');
					
					expect(ctrl.pairs[c1][c2].period).toBe(ctrl.period);
				}
			}
			done();
		});
		httpBackend.flush();
	});
	
	it('finds the greatest and least percent difference overall and vs one currency - testing vm.findGreatest()', function(done) {
		fillTablePromise.then(function(success) {
			ctrl.findGreatest();
			var countGreatestVsC1=0;
			var countLeastVsC1=0;
			var countGreatest=0;
			var countLeast=0;
			var c1,c2;

			for (var i=0; i<ctrl.currencies.length; i++)
			{
				countGreatestVsC1=0;
				countLeastVsC1=0;
				for (var j=0; j<ctrl.currencies.length; j++)
				{
					c1=ctrl.currencies[i];
					c2=ctrl.currencies[j];
					countGreatestVsC1+=ctrl.pairs[c1][c2].greatestVsC1;
					countLeastVsC1+=ctrl.pairs[c1][c2].leastVsC1;
					countGreatest+=ctrl.pairs[c1][c2].greatest;
					countLeast+=ctrl.pairs[c1][c2].least;
				}
				expect(countGreatestVsC1).toBe(1);
				expect(countLeastVsC1).toBe(1);
			}
			expect(countGreatest).toBe(1);
			expect(countLeast).toBe(1);
			done();
		});
		
		httpBackend.flush();
	});
});