'use strict'

describe('read', function() {
	beforeEach(function() {
		module('forex.factories');
		inject(function($injector) {
			$http = $injector.get('$http');
		});
	});
	
	it('should return a promise containing data read from file', function(done) {
		var pair = 'eurusd';
		var promise = $http.get("/readfromfile/"+pair);
		var response;
		
		promise.then(function(fileResponse) {
			response = fileResponse;
		});
		
		$httpBackend
			.when('GET','/readfromfile/'+pair)
			.respond(200,{	"success":1,
							"data":[{"1":{	"Date":"1993/05/11",
											"Open":"1.2414",
											"High":"1.2416",
											"Low":"1.2376",
											"Close":"1.2378",
											"Volume":"0",
											"OpenInterest":"0"},
									 "2":{	"Date":"1993/05/12",
											"Open":"1.2378",
											"High":"1.238",
											"Low":"1.2353",
											"Close":"1.2355",
											"Volume":"0",
											"OpenInterest":"0"},
									 "3":{	"Date":"1993/05/13",
											"Open":"1.2355",
											"High":"1.2357",
											"Low":"1.2225",
											"Close":"1.2227",
											"Volume":"0",
											"OpenInterest":"0"}}]});
		
		$httpBackend.flush();
		
		expect(response.success).toBe(1);
		expect(typeof response.data).toBe('object');
		expect(response.data.length).toBe(3);
		expect(typeof response.data[0]).toBe('undefined');
		expect(typeof response.data[1]).toBe('object');
		expect(0).toBe(1);
		
		done();
	});
});

angular.module('forex.factories')

.factory('fileHandler', function($http) {
	return {
		read: function(pair) {
			return $http.get("/readfromfile/"+pair);
		}
	};		
});