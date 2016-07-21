'use strict'

describe('HeadController',function() {
	var headCtrl=null,page=null;
	beforeEach(module('forex'));
	beforeEach(inject(function($controller,Page) {
		headCtrl=$controller('HeadController', {
			Page:Page,
		});
		page=Page;
	}));
	
	it('can get an instance of the controller',function() {
		expect(headCtrl).toBeDefined();
	});
	
	it('sets the title',function() {
		expect(page.title()).toBe('loading');		
	});
});