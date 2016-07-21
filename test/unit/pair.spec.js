'use strict'

describe('Pair', function () {
  var Pair=null, 
	  //$dbHandler=null,
	  $httpBackend, injector, $q, $scope;
  var dbHandlerMock;
  var pair='eurusd';
  var sdate='2016-01-01';
  var edate='2015-12-20';
  var period=10;
  
  beforeEach(function() {
	  module('forex.factories')
  });
  beforeEach(inject(function ($injector) {
	injector=$injector;
	//$dbHandler = $injector.get('dbHandler');
	$httpBackend = $injector.get('$httpBackend');
	$q = $injector.get('$q');
	$scope = $injector.get('$rootScope').$new();
	jasmine.getJSONFixtures().fixturesPath='c:/projects/mean/forex/test/mock/';
	//mockData = getJSONFixture('pair.spec.mockdata.json');
	
	dbHandlerMock = {
		getDatesCalled:false,
		
		getDates: function(pair) {
			var _this = this;
			return $q(function(resolve,reject) {
				_this.getDatesCalled=true;
				var response = { data: { start: {date: '1993-01-01'}, end: {date: '1994-01-01'} }};
				resolve(response);
			});
		},		
		storeArray: function(pair,data_array,messages) {
			var _this = this;
			return $q(function(resolve,reject) {
				var response=[ { data: { status:'5 records added', } } ];
				resolve(response);
			});
		},
	};
	Pair=$injector.get('Pair');
  }));
  
  it('can get an instance of my factory', function() {
    expect(Pair).toBeDefined();
  });
  
  it('can get an instance of the obj member of my factory', function() {
	expect(Pair.obj).toBeDefined();
  });
  
  it('can accept 0 arguments', function() {
	var obj = new Pair.obj();
	expect(obj).toBeDefined();
	expect(obj.c1).toBe('eur');
	expect(obj.c2).toBe('usd');
	expect(obj.pair).toBe('eurusd');
	expect(obj.period).toBe(60);
  });
  
  it('can accept 1 argument: pair', function() {
	var obj = new Pair.obj('audusd');
	expect(obj).toBeDefined();
	expect(obj.c1).toBe('aud');
	expect(obj.c2).toBe('usd');
	expect(obj.period).toBe(60);
  });
  
  it('can accept 2 arguments: pair, period', function() {
	var obj = new Pair.obj('gbpjpy',30);
	expect(obj).toBeDefined();
	expect(obj.c1).toBe('gbp');
	expect(obj.c2).toBe('jpy');
    expect(obj.period).toBe(30); 
  });
  
  it('can accept 2 arguments: c1, c2', function() {
	var obj = new Pair.obj('cad','chf');
	expect(obj).toBeDefined();
	expect(obj.pair).toBe('cadchf');
	expect(obj.period).toBe(60); 
  });
  
  it('can accept 3 arguments: c1, c2, period', function() {
	var obj = new Pair.obj('nzd','usd',15);
	expect(obj).toBeDefined();
	expect(obj.c1).toBe('nzd');
	expect(obj.c2).toBe('usd');
	expect(obj.pair).toBe('nzdusd');
	expect(obj.period).toBe(15); 
  });
  
  it('can read from the data file and store to the db - readAndStore()', function(done) {
	var obj = new Pair.obj();
		var _data = [{	"1":{  	"Date":"1993/05/11",
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
                                            "OpenInterest":"0"}}];
	
	$httpBackend.when('GET','/readfromfile/'+obj.pair)
                .respond(200,{  "success":1, "data":_data });

	$httpBackend.whenRoute('POST','/storeindb/:pair?data=:data')
				.respond(200,{	"success":1, "status":'5 records added' });
				
	obj.readAndStore().then(function(success) {
		expect(success).toBe('5 records added');
		done();
	});
	$httpBackend.flush();
	$scope.$digest();
  });
  
  
  it('can set the dbStartDate and dbEndDate variables - setDates()', function(done) {
	var obj = new Pair.obj();
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
  
  it('can set the difference - setDifference()', function(done) {
	  
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
	
	var obj = new Pair.obj();
	
	obj.setDifference().finally(function() {
		expect(+obj.difference).toBe(0.90);
		done();
	});
	
	$httpBackend.flush();
  });
});