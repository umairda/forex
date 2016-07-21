(function() {
	'use strict';
	
	var highchartController = function(dbHandler,$q,$scope) {
		var vm = this;
			
		vm.chartData=0;
		vm.chartObj=0;
		
		vm.getChartData = function() {
			var deferred = $q.defer();			
			var ohlc = [];
			var promise = dbHandler.read(vm.pair).then(function(response) {
				for (var i=0; i<response.data.length; i++) {
					var datum = [];
					var dateObj = new Date(response.data[i].date);
					datum[0] = dateObj;
					datum[1] = response.data[i].open;
					datum[2] = response.data[i].high;
					datum[3] = response.data[i].low;
					datum[4] = response.data[i].close;
				
					ohlc.push(datum);
				}
			}).finally(function() {
				//console.log('ohlc',ohlc);
				deferred.resolve(ohlc);
			});
			return deferred.promise;
		};
		
		vm.updateChart = function(ohlc) {
			delete vm.chartData;
			vm.chartData = {
				title: {
					text: vm.pair,
				},
				xAxis: {
					type: 'datetime',
					dateTimeLabelFormats: {
						second: '%Y-%m-%d<br/>%H:%M:%S',
						minute: '%Y-%m-%d<br/>%H:%M',
						hour: '%Y-%m-%d<br/>%H:%M',
						day: '%Y<br/>%m-%d',
						week: '%Y<br/>%m-%d',
						month: '%Y-%m',
						year: '%Y'
					},
					minRange:1000*3600,
					title:'date',
				},
				yAxis: {
					title:'exchange rate'
				},
				series: [{
					data: ohlc,
					name: vm.pair,
					type: 'candlestick',
					dataGrouping: {
							units:[	['day',[1]],['week',[1]],['month',[1]],['year',[1]]	]
					}
				}],
			};
		};
	};
	
	angular.module('forex.directives').directive('highchart', function() {
		return {
			restrict: 'E',
			template: '<div class="my_highchart"></div>',
			controller: highchartController,
			controllerAs: 'ctrl',
			scope: {
				pair: "=pair",
			},
			bindToController: true,
			transclude: true,
			replace: true,
			link: function($scope, $element, $attrs, ctrl) {	
			
				//Update when charts data changes
				$scope.$watch(function watchPair(scope) {
						return $scope.ctrl.pair;
					}, function(value,oldValue) {
						if (!value) { return; }
					
						var promise = $scope.ctrl.getChartData();

						if (angular.isDefined(promise)) {
							promise.then(function(ohlc) {
								ctrl.updateChart(ohlc);
								ctrl.chartData.chart = ctrl.chartData.chart || {};
								ctrl.chartData.chart.renderTo = ctrl.chartData.chart.renderTo || $element[0];
								
								if ($attrs.type) {
									ctrl.chartData.chart.type = ctrl.chartData.chart.type || $attrs.type; }
								if ($attrs.height) {
									ctrl.chartData.chart.height = ctrl.chartData.chart.height || $attrs.height; }
								if ($attrs.width) {
									ctrl.chartData.chart.width = ctrl.chartData.chart.type || $attrs.width; }

								ctrl.chartObj = new Highcharts.StockChart(ctrl.chartData);
							});
						}
				});
			}
		};
	});
})();