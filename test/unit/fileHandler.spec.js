'use strict'

function isPromise(deferred) {
    return (angular.isObject(deferred) &&
        angular.isObject(deferred.promise) &&
        deferred.promise.then instanceof Function &&
        deferred.promise['catch'] instanceof Function && 
        deferred.promise['finally'] instanceof Function);
}

function isHttpPromise(promise) {
    return (angular.isObject(promise) && 
   promise.then instanceof Function && 
   promise["catch"] instanceof Function && 
   promise["finally"] instanceof Function && 
   promise.error instanceof Function && 
   promise.success instanceof Function);
}

describe('fileHandler', function() {    
    describe('read',function() {
        var fileHandler, $httpBackend, pair='eurusd';
        var promise=0,response=0;
        
        beforeEach(module('forex.factories'));
        
        beforeEach(inject(function($injector) {
            fileHandler = $injector.get('fileHandler');
            $httpBackend = $injector.get('$httpBackend');
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
                
                promise = fileHandler.read(pair);
        
                promise.then(function(fileResponse) {
                    response = fileResponse;
                });
                
                $httpBackend.flush();

        }));
        
        it('should receive a GET request from /readfromfile/'+pair,function() {
            $httpBackend.expectGET('/readfromfile/'+pair);
        });
        
        it('should return a promise containing data read from file', function() {
            expect(isHttpPromise(promise)).toBe(true);
        });
        
        it('response.data.length should be 2', function() {
            expect(Object.keys(response.data).length).toBe(2);
        });
        
        it('the response.success should be 1', function() {         
            expect(response.data.success).toBe(1);
        });
            
        it('response.data should be an object', function() {
            expect(typeof response.data).toBe('object');
        });
        
        it('response.data[0] should be an object', function() {
            expect(typeof response.data.data[0]).toBe('object');
        });
        
        it('response.data[0][1] should be an object', function() {
            expect(typeof response.data.data[0][1]).toBe('object');
        });
    });
});