'use strict'


describe('pairObj', function () {
  
  var dbHandler, fileHandler, splitMongoDate;
  var pairObj;
  
  beforeEach(function() {
	module('forex.factories')
	inject(function($injector) {
		dbHandler = $injector.get('dbHandler');
		fileHandler = $injector.get('fileHandler');
		splitMongoDate = $injector.get('splitMongoDate');
		pairObj = $injector.get('pairObj');
		$q = $injector.get('$q');
		
		spyOn(fileHandler,['read']).and.returnValue($q.when(
			{fileResponse:{data: {{status:1},
							      {data:
		
		spyOn(dbHandler,['storeArray']).and.returnValue($q.when(
			{dbResponse:[{data: {status:'10 records added'}},
						 {data: {status:'20 records added'}},
						 {data: {status:'30 records added'}},]}));
						 
		
									

  it('can get an instance of my factory', inject(function($q,dbHandler,fileHandler,splitMongoDate) {
    expect(pairObj).toBeDefined();
  }));
  
  it
});