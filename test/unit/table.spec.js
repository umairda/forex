'use strict'

describe('TableController', function() {
	var $scope = null;
	var ctrl = null;
	var pairObjFactory;
	var mockFunctionCalled=0;
	
	beforeEach(module('forex'));
	beforeEach(inject(function($rootScope,$controller,$q,pairObjFactory) {
		$scope = $rootScope.$new();
		ctrl = $controller('TableController', {
			$q: $q,
			pairObjFactory: pairObjFactory
		});
		//pairObjFactory = $injector.get('pairObjFactory');
	}));
	
	xit('fills the table with pair objects and initializes them - testing vm.fillTable()', function(done) {
		var promise = ctrl.fillTable();
		promise.then(function(success) {
			for (var i=0; i<ctrl.currencies.length; i++)
			{
				expect(ctrl.pairs[i].length).toBe(ctrl.currencies.length);
				
				for (var j=0; j<ctrl.currencies.length; j++)
				{
					if (i==j) expect(ctrl.pairs[i][j].difference).toBe('-');
					else expect(ctrl.pairs[i][j].difference).not.toBe('-');
					
					expect(ctrl.pairs[i][j].period).toBe(ctrl.period);
				}
			}
			done();
		});
	});
	
	xit('finds the greatest and least percent difference overall and vs one currency - testing vm.findGreatest()', function(done) {
		ctrl.fillTable().then(function(success) {
			console.log('before find greatest');
			ctrl.findGreatest();
			var countGreatestVsC1=0;
			var countLeastVsC1=0;
			var countGreatest=0;
			var countLeast=0;
			console.log('ctrl.pairs',ctrl.pairs);
			for (var i=0; i<ctrl.currencies.length; i++)
			{
				countGreatestVsC1=0;
				countLeastVsC1=0;
				for (var j=0; j<ctrl.currencies.length; j++)
				{
					countGreatestVsC1+=ctrl.pairs[i][j].greatestVsC1;
					countLeastVsC1+=ctrl.pairs[i][j].leastVsC1;
					countGreatest+=ctrl.pairs[i][j].greatest;
					countLeast+=ctrl.pairs[i][j].least;
				}
				expect(countGreatestVsC1).toBe(1);
				expect(countLeastVsC1).toBe(1);
			}
			expect(countGreatest).toBe(1);
			expect(countLeast).toBe(1);
			done();
		});
	});
});