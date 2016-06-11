'use strict'

describe('Page', function() {	

		var Page;
				
		beforeEach(module('forex.factories'));
		
		beforeEach(inject(function($injector) {
			Page = $injector.get('Page');
		}));
		
		it('should be defined',function() {
			expect(Page).toBeDefined();
		});
		
		it('should set the title', function() {
			expect(Page.title()).toBe('default');
			Page.setTitle('test');
			expect(Page.title()).toBe('test');
		});
});