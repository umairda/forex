'use strict'

describe('component: pairSelect', function () {
  var dbStartDateObj, dbEndDateObj,
	  pairSelectCtrl=null,
	  $scope=null;
  
  beforeEach(function() {
	  module('forex');	
  });
  beforeEach(inject(function($componentController,$provide,$rootScope) {
	
	var pairObjFactoryMock = function() {
		var pairObj = function(){
			this.setDates = function() {
				return $q(function(resolve,reject) {
					resolve(1);
				});
			};
		};
		return {
			pairObj:pairObj
		}
	  }
	  $provide.value('pairObjFactory',pairObjFactoryMock); 
	
	pairSelectCtrl = $componentController('pairSelect', {pairObjFactory: pairObjFactoryMock},
		{pair: 'eurusd', dbStartDateObj: dbStartDateObj, dbEndDateObj: dbEndDateObj});
	
	var pairObj = function() {
		
	};
	$scope=$rootScope.$new();
  }));
  
  it('generates an array of currency pairs', function() {
    expect(pairSelectCtrl.pairs.length).toBe(pairSelectCtrl.currencies.length*(pairSelectCtrl.currencies.length-1));
  });
  
  it('sets pair to the first element in the pairs array', function() {
	 expect(pairSelectCtrl.pair).toBe(pairSelectCtrl.pairs[0]); 
  });
  
  it('can set the dates - setDates()',function() {
	  pairSelectCtrl.setDates();
	  $scope.$digest();
	  console.log(dbStartDateObj,dbEndDateObj);
	  expect(pairSelectCtrl.dbStartDateObj).toBe(new Date('1993-01-01'));
	  expect(pairSelectCtrl.dbEndDateObj).toBe(new Date('1994-01-01'));
  });
  
  xit('can set the pair - update(pair)', function() {
	expect(pairSelectCtrl.pair).toBe('eurusd');
	pairSelectCtrl.update('gbpcad');
    expect(pairSelectCtrl.pair).toBe('gbpcad');	
  });
});