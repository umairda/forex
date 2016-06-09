'use strict';

var app = angular.module('forex.head', [])

var HeadController = function(Page) {
	var vm = this;
	vm.page = Page;
	vm.page.setTitle('loading');
}

HeadController.$inject = ['Page'];

app.controller('HeadController',HeadController);