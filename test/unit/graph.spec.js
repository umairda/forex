'use strict'

describe('GraphCtrl', function() {
	var $scope = null;
	var ctrl = null;
	var mockFunctionCalled=0;
	
	beforeEach(module('forex'));
	beforeEach(inject(function($rootScope,$controller) {
		$scope = $rootScope.$new();
		ctrl = $controller('GraphController', {
			$scope: $scope,
		});
		ctrl.updateChartData = function(pair) {
			mockFunctionCalled=1;
		};
	}));
	
	it('watches $scope.pair and on change calls updateChartData', function() {
		spyOn(ctrl,'updateChartData');
		
		ctrl.pair = 'eurusd';
		$scope.$digest();
		
		ctrl.pair = 'gbpaud';
		$scope.$digest();
		
		expect(ctrl.updateChartData).toHaveBeenCalledWith(ctrl.pair);
	});
});