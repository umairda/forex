'use strict'

describe('headController',function() {
	var head=null,page=null;
	beforeEach(module('forex'));
	beforeEach(inject(function($controller,Page) {
		head=$controller('HeadController', {
			Page:Page,
		});
		page=Page;
	}));
	
	it('sets the title',function() {
		expect(page.title()).toBe('loading');		
	});
});