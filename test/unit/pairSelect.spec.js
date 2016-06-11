'use strict'

describe('component: pairSelect', function () {
  var componentController=null,
	  dbStartDateObj, dbEndDateObj,
	  pairObjFactoryMock=null,
	  pairSelectCtrl=null;
  
  beforeEach(function() {
	  module('forex');
	  module(function($provide) {
		 $provide.value('pairObjFactory',pairObjFactoryMock); 
	  });
  });
  beforeEach(inject(function ($componentController,$rootScope) {
	componentController=$componentController;
	component = componentController('pairSelect',
		{pair: 'eurusd'},
		{dbStartDateObj: dbStartDateObj},
		{dbEndDateObj: dbEndDateObj}
	);
	pairObjFactoryMock = {
		dbStartDate:'1993-01-01',
		dbEndDate:'1994-01-01',
		pairObj: {
			setDates: function() {
				return $q(function(resolve,reject) {
					resolve(1);
				});
			}
		}
	};
	pairSelectCtrl = $controller('pairSelect',{
		pairObjFactory: pairObjFactoryMock,
	});
	$scope=$rootScope.$new();
  }));
  
  xit('generates an array of currency pairs', function() {
    expect(pairSelectCtrl.pairs.length).toBe(pairSelectCtrl.currencies.length*(pairSelectCtrl.currencies.length-1));
  });
  
  xit('sets pair to the first element in the pairs array', function() {
	 expect(pairSelectCtrl.pair).toBe(pairSelectCtrl.pairs[0]); 
  });
  
  xit('can set the dates - setDates()',function() {
	  pairSelectCtrl.setDates();
	  $scope.$digest();
	  expect(pairSelectCtrl.dbStartDateObj).toBe(new Date('1993-01-01'));
	  expect(pairSelectCtrl.dbEndDateObj).toBe(new Date('1994-01-01'));
  });
  
  xit('can set the pair - update(pair)', function() {
	expect(pairSelectCtrl.pair).toBe('eurusd');
	pairSelect.update('gbpcad');
    expect(pairSelectCtrl.pair).toBe('gbpcad');	
  });
});