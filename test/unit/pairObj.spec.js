'use strict'

describe('pairObjFactory', function () {
  var pairObjFactory=0, 
	  dbHandler=0,
	  fileHandler=0,
	  splitMongoDate=0,
	  $http, $httpBackend, $q, mockData;
  var pair='eurusd';
  var sdate='2016-01-01';
  var edate='2015-12-20';
  var period=10;
  
  beforeEach(module('forex.factories'));
  beforeEach(inject(function ($injector) {
	$http = $injector.get('$http');
	$httpBackend = $injector.get('$httpBackend');
	$q = $injector.get('$q');
	pairObjFactory = $injector.get('pairObjFactory');
	dbHandler = $injector.get('dbHandler');
	fileHandler = $injector.get('fileHandler');
	splitMongoDate = $injector.get('splitMongoDate');
	jasmine.getJSONFixtures().fixturesPath='c:/projects/mean/forex/test/mock/';
	//mockData = getJSONFixture('pairObj.spec.mockdata.json');
  }));
  
  it('can get an instance of my factory', function() {
    expect(pairObjFactory).toBeDefined();
	expect(pairObjFactory.pairObj).toBeDefined();
  });
  
  it('can accept 0 arguments', function() {
	var obj = new pairObjFactory.pairObj();
	expect(obj).toBeDefined();
	expect(obj.c1).toBe('eur');
	expect(obj.c2).toBe('usd');
	expect(obj.pair).toBe('eurusd');
	expect(obj.period).toBe(60);
  });
  
  it('can accept 1 argument: pair', function() {
	var obj = new pairObjFactory.pairObj('audusd');
	expect(obj).toBeDefined();
	expect(obj.c1).toBe('aud');
	expect(obj.c2).toBe('usd');
	expect(obj.period).toBe(60);
  });
  
  it('can accept 2 arguments: pair, period', function() {
	var obj = new pairObjFactory.pairObj('gbpjpy',30);
	expect(obj).toBeDefined();
	expect(obj.c1).toBe('gbp');
	expect(obj.c2).toBe('jpy');
    expect(obj.period).toBe(30); 
  });
  
  it('can accept 2 arguments: c1, c2', function() {
	var obj = new pairObjFactory.pairObj('cad','chf');
	expect(obj).toBeDefined();
	expect(obj.pair).toBe('cadchf');
	expect(obj.period).toBe(60); 
  });
  
  it('can accept 3 arguments: c1, c2, period', function() {
	var obj = new pairObjFactory.pairObj('nzd','usd',15);
	expect(obj).toBeDefined();
	expect(obj.c1).toBe('nzd');
	expect(obj.c2).toBe('usd');
	expect(obj.pair).toBe('nzdusd');
	expect(obj.period).toBe(15); 
  });
  
  xit('can read from the data file and store to the db', function(done) {
	$httpBackend.when('GET','/readfromfile/'+pair)
                .respond(200,{  "success":1,
                                "data":[{"1":{  "Date":"1993/05/11",
                                            "Open":"1.2414",
                                            "High":"1.2416",
                                            "Low":"1.2376",
                                            "Close":"1.2378",
                                            "Volume":"0",
                                            "OpenInterest":"0"},
                                     "2":{  "Date":"1993/05/12",
                                            "Open":"1.2378",
                                            "High":"1.238",
                                            "Low":"1.2353",
                                            "Close":"1.2355",
                                            "Volume":"0",
                                            "OpenInterest":"0"},
                                     "3":{  "Date":"1993/05/13",
                                            "Open":"1.2355",
                                            "High":"1.2357",
                                            "Low":"1.2225",
                                            "Close":"1.2227",
                                            "Volume":"0",
                                            "OpenInterest":"0"}}]}); 
  });
  
  
  it('can set the dbStartDate and dbEndDate variables', function(done) {
	var obj = new pairObjFactory.pairObj();

	$httpBackend.when('GET','/getDates/'+obj.pair)
				.respond(200,{	"start":
									{	"instrument":"eurusd",
										"date":"1993-05-11T00:00:00.000Z"},
								"end":
									{	"instrument":"eurusd",
										"date":"2016-05-27T00:00:00.000Z"}	});
	
	obj.setDates().finally(function() {
		expect(obj.dbStartDate).toBe('1993-05-11');
		expect(obj.dbEndDate).toBe('2016-05-27');
		done();
	});	
	$httpBackend.flush();
  });
  
  it('can set the difference', function(done) {
	  
	$httpBackend.when('GET','/getDifference/eurusd/'+new Date()+'/60')
				.respond(200,{	"sdoc":	{
								"instrument":"eurusd",
								"date":"2016-05-27T00:00:00.000Z",
								"open":1.119395,
								"high":1.12008,
								"low":1.111095,
								"close":1.11138,
								"openinterest":176662,
								"volume":176662},
							"edoc":	{
								"instrument":"eurusd",
								"date":"2016-03-07T00:00:00.000Z",
								"open":1.09905,
								"high":1.1025851,
								"low":1.09401,
								"close":1.1014199,
								"openinterest":186049,
								"volume":186049},
							"pct_diff":"0.90"	});
	
	var obj = new pairObjFactory.pairObj();
	
	obj.setDifference().finally(function() {
		expect(+obj.difference).toBe(0.90);
		done();
	});
	
	$httpBackend.flush();
  });
});