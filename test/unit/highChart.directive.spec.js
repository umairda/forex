(function() {

	'use strict';

	describe('currencyTable',function() {
	
		var $compile,$q,$scope;
		var element, highchartCtrl = 0;
		var dataLength = 3;
		var data = [];
		
		beforeEach(module('forex'));
		beforeEach(module('my.templates'));
		beforeEach(module(function($provide) {			
			$provide.service('dbHandler',function() {
				var vm = this;
				data = [];
				var startDate = new Date('2016-01-01');
				for (var i = 0; i<dataLength; i++) {
					var currentDate = new Date(startDate.getDate() + i);
					var year = currentDate.getFullYear();
					var month = currentDate.getMonth()+1;
					var day = currentDate.getDate();
					var currentDate = year+'-'+month+'-'+day;
					data.push({ 	date: currentDate,
										open: 1.234567890,
										high: 2.345678901,
										low: 0.123456789,
										close: 1.324567890 });
				}
					
				vm.read = function(pair) {				
					return $q.when({ data: data });
				};
			});
		}));
		beforeEach(inject(function(_$compile_,_$q_,$rootScope) {
			$compile = _$compile_;
			$q = _$q_;
			$scope = $rootScope.$new();
			
			element = angular.element('<highchart pair="pair"></highchart>');
			$scope.pair = 'audcad';
			element = $compile(element)($scope);
			$scope.$apply();
			highchartCtrl = element.controller('highchart');	
			//console.log(element);
		}));
		
		it("'s controller should be defined",function() {			
			expect(highchartCtrl).toBeDefined();
			expect(highchartCtrl).not.toBe(0);
		});	
		
		it("should watch the value of the pair binding and update the chart", function() {
			spyOn(highchartCtrl,'updateChart');
			spyOn(highchartCtrl,'getChartData');
			$scope.pair = 'cadeur';
			$scope.$apply();
			expect(highchartCtrl.getChartData).toHaveBeenCalled();
		});
		
		it("s getChartData function should read data from the db", function(done) {
			var promise = highchartCtrl.getChartData();
			promise.then(function(ohlc) {
				expect(ohlc.length).toBe(dataLength);
				done();
			});
			$scope.$apply();
		});
		
		it("s updateChart function should update the vm.chartData varaible", function() {
			highchartCtrl.chartData = null;
			expect(highchartCtrl.chartData).toBe(null);
			highchartCtrl.updateChart();
			expect(highchartCtrl.chartData).not.toBe(null);
		});
		
	});
}());