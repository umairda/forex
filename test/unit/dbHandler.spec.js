'use strict'

describe('dbHandler', function () {
  
  beforeEach(module('forex'));

  beforeEach(module(function ($provide) {
    $provide.value('oneOfMyOtherServicesStub', {
        someVariable: 1
    });
  }));

  it('can get an instance of my factory', inject(function(dbHandler) {
    expect(dbHandler).toBeDefined();
  }));
});