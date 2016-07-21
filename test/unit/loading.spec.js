(function() {

	'use strict';

	describe('loading component',function() {
	
		var $scope;
		var element, loadingCtrl = 0;
		
		beforeEach(module('forex'));
		beforeEach(module('my.templates'));
		
		beforeEach(inject(function($compile,$rootScope,$timeout) {
			$scope = $rootScope.$new();
			
			element = angular.element('<loading></loading>');
			element = $compile(element)($scope);
			$scope.$apply();
			loadingCtrl = element.controller('loading');	
			//console.log(element);
		}));
	
		it("'s controller should be defined",function() {
			expect(loadingCtrl).toBeDefined();
			expect(loadingCtrl).not.toBe(0);
		});	
		
	});
}());