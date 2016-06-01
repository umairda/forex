'use strict'

describe('dbHandler', function () {
  
  beforeEach(module('forex.factories'));

  beforeEach(module(function ($http,$q) {
	  
  }));

  it('can get an instance of my factory', inject(function(dbHandler) {
    expect(dbHandler).toBeDefined();
  }));
});