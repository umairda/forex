'use strict'

describe('splitMongoDate', function() {	

		var splitMongoDate, obj=0;
				
		beforeEach(module('forex.factories'));
		
		beforeEach(inject(function($injector) {
			splitMongoDate = $injector.get('splitMongoDate');
			
			obj = splitMongoDate('1993-05-11T12:34:56.789Z');
		}));
		
		it('should be an object',function() {
			expect(angular.isObject(obj)).toBe(true);
		});
		
		it('should correctly parse the date', function() {
			expect(obj.year).toBe(1993);
			expect(obj.month).toBe(5);
			expect(obj.day).toBe(11);
			expect(obj.hour).toBe(12);
			expect(obj.minute).toBe(34);
			expect(obj.second).toBe(56);
			expect(obj.ms).toBe(789);
			expect(obj.ymd).toBe('1993-05-11');
			expect(obj.hms).toBe('12:34:56.789Z');
		});
});