'use strict'

describe('dbHandler', function () {
  var dbHandler = 0, $http, $httpBackend, $q, mockData;
  var pair='eurusd';
  var sdate='2016-01-01';
  var edate='2015-12-20';
  var period=10;
  
  beforeEach(module('forex.factories'));
  beforeEach(inject(function ($injector) {
	$http = $injector.get('$http');
	$httpBackend = $injector.get('$httpBackend');
	$q = $injector.get('$q');
	dbHandler = $injector.get('dbHandler');
	jasmine.getJSONFixtures().fixturesPath='c:/projects/mean/forex/test/mock/';
	//mockData = getJSONFixture('dbHandler.spec.mockdata.json');
  }));
  
  it('can get an instance of my factory', function() {
    expect(dbHandler).toBeDefined();
  });
  
  it('can get the percent difference between two dates', function(done) {
	$httpBackend.when('GET','/getDifference/'+[pair,sdate,period].join('/'))
				.respond({	"sdoc":	{	
								"instrument":"eurusd",
								"date":"2015-12-31T00:00:00.000Z",
								"open":1.0932,
								"high":1.09372,
								"low":1.085295,
								"close":1.086545,
								"openinterest":130036,
								"volume":130036},
							"edoc": {
								"instrument":
								"eurusd",
								"date":
								"2015-12-17T00:00:00.000Z",
								"open":1.0911551,
								"high":1.091435,
								"low":1.0802701,
								"close":1.08259,
								"openinterest":310947,
								"volume":310947},
							"pct_diff":"0.37"});
							
	var promise = dbHandler.getDifference(pair,sdate,period);
	promise.then(function(response) {
		expect(response.status).toBe(200);
		expect(response.data).toBeDefined();
		expect(response.data.sdoc).toBeDefined();
		expect(response.data.sdoc.date).toBeDefined();
		expect(response.data.edoc).toBeDefined();
		expect(response.data.edoc.high).toBeDefined();
		expect(response.data.pct_diff).toBeDefined();
		done();
	});
	$httpBackend.flush();
  });
  
  it('can get the start and end dates',function(done) {
	$httpBackend.when('GET','/getDates/'+pair)
				.respond({	"start":	{	
								"instrument":"eurusd",
								"date":"1993-05-11T00:00:00.000Z"},
							"end":		{
								"instrument":"eurusd",
								"date":"2016-05-27T00:00:00.000Z"}});
							
	var promise = dbHandler.getDates(pair,sdate,period);
	promise.then(function(response) {
		//console.log('response',response);
		//console.log('response.data',response.data);
		expect(response.status).toBe(200);
		expect(response.data).toBeDefined();
		expect(response.data.start).toBeDefined();
		expect(response.data.start.date).toBeDefined();
		expect(response.data.end).toBeDefined();
		expect(response.data.end.instrument).toBeDefined();
		done();
	});
	$httpBackend.flush();
  });
  
  it('can get the most recent price data',function(done) {
	$httpBackend.when('GET','/getLast/'+pair)
				.respond({	"_id":"574a8b6ba730b9d404e68a7c",
							"instrument":"eurusd",
							"date":"2016-05-27T00:00:00.000Z",
							"open":1.119395,
							"high":1.12008,
							"low":1.111095,
							"close":1.11138,
							"__v":0,
							"openinterest":176662,
							"volume":176662});
							
	var promise = dbHandler.getLast(pair);
	promise.then(function(response) {
		//console.log('response',response);
		//console.log('response.data',response.data);
		expect(response.status).toBe(200);
		expect(response.data).toBeDefined();
		expect(response.data.instrument).toBeDefined();
		expect(response.data.date).toBeDefined();
		expect(response.data.close).toBeDefined();
		expect(response.data.volume).toBeDefined();
		done();
	});
	$httpBackend.flush();
  });   

  it('can read all the data when supplied with only the pair',function(done) {
	$httpBackend.when('GET','/readfromdb/'+pair)
				.respond([{	"date":"1993-05-11T00:00:00.000Z",
							"open":1.2414,
							"high":1.2416,
							"low":1.2376,
							"close":1.2378,
							"__v":0,
							"openinterest":0,
							"volume":0},
							{"date":"1993-05-11T07:00:00.000Z",
							"open":1.2414,
							"high":1.2416,
							"low":1.2376,
							"close":1.2378,
							"__v":0,
							"openinterest":0,
							"volume":0},
							{"date":"1993-05-12T00:00:00.000Z",
							"open":1.2378,
							"high":1.238,
							"low":1.2353,
							"close":1.2355,
							"__v":0,
							"openinterest":0,
							"volume":0}]);
							
	var promise = dbHandler.read(pair);
	promise.then(function(response) {
		expect(response.status).toBe(200);
		expect(response.data).toBeDefined();
		expect(response.data.length).toBe(3);
		expect(response.data[1].open).toBeDefined();
		expect(response.data[2].date).toBeDefined();
		expect(response.data[0].close).toBeDefined();
		expect(response.data[1].volume).toBeDefined();
		done();
	});
	$httpBackend.flush();
  });      
  
  it('can read the data when supplied with the pair, start, and end dates',function(done) {
	$httpBackend.when('GET','/readfromdb/'+[pair,sdate,edate].join('/'))
				.respond([{	"date":"1993-05-11T00:00:00.000Z",
							"open":1.2414,
							"high":1.2416,
							"low":1.2376,
							"close":1.2378,
							"__v":0,
							"openinterest":0,
							"volume":0},
							{"date":"1993-05-11T07:00:00.000Z",
							"open":1.2414,
							"high":1.2416,
							"low":1.2376,
							"close":1.2378,
							"__v":0,
							"openinterest":0,
							"volume":0},
							{"date":"1993-05-12T00:00:00.000Z",
							"open":1.2378,
							"high":1.238,
							"low":1.2353,
							"close":1.2355,
							"__v":0,
							"openinterest":0,
							"volume":0}]);
							
	var promise = dbHandler.readDatesSpecified([pair,sdate,edate]);
	promise.then(function(response) {
		expect(response.status).toBe(200);
		expect(response.data).toBeDefined();
		expect(response.data.length).toBe(3);
		expect(response.data[1].open).toBeDefined();
		expect(response.data[2].date).toBeDefined();
		expect(response.data[0].close).toBeDefined();
		expect(response.data[1].volume).toBeDefined();
		done();
	});
	$httpBackend.flush();
  });    

  it('can store data in the db - store()',function(done) {
	var data = [{	"date":"1993-05-11T00:00:00.000Z",
							"open":1.2414,
							"high":1.2416,
							"low":1.2376,
							"close":1.2378,
							"__v":0,
							"openinterest":0,
							"volume":0},
							{"date":"1993-05-11T07:00:00.000Z",
							"open":1.2414,
							"high":1.2416,
							"low":1.2376,
							"close":1.2378,
							"__v":0,
							"openinterest":0,
							"volume":0},
							{"date":"1993-05-12T00:00:00.000Z",
							"open":1.2378,
							"high":1.238,
							"low":1.2353,
							"close":1.2355,
							"__v":0,
							"openinterest":0,
							"volume":0}];

	$httpBackend.whenRoute('POST','/storeindb/:pair?data=:data')
				.respond(200, {	"status": "complete 10 records added",
							"messages": ["message1","message2","message3"]});
							
	var promise = dbHandler.store(pair,data);
	promise.then(function(response) {
		expect(response.status).toBe(200);
		expect(response.data).toBeDefined();
		expect(response.data.status).toBe('complete 10 records added');
		expect(response.data.messages.length).toBe(3);
		
		done();
	});
	$httpBackend.flush();
  });       
  
});