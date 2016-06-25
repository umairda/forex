(function() {
	'use strict';

	angular.module('forex').directive('chart', function(dbHandler) {
		return {
			restrict: 'E',
			template: '<div></div>',
			scope: {
				chartData: "=value",
				chartObj: "=?",
				control: "=?"
			},
			transclude: true,
			replace: true,
			link: function($scope, $element, $attrs) {
				
				$scope.control.updateChartData = function(pair) {
					console.log('updateChartData',pair);
					dbHandler.read(pair).then(function(response) {
						delete $scope.ohlc;
						$scope.ohlc = [];
						for (var i in response.data) {
							var datum = [];
							var dateObj = new Date(response.data[i].date);
							datum[0] = dateObj;
							datum[1] = response.data[i].open;
							datum[2] = response.data[i].high;
							datum[3] = response.data[i].low;
							datum[4] = response.data[i].close;
					
							$scope.ohlc.push(datum);
						}
					}).finally(function() {
						delete $scope.chartData;
						var title = pair;
						
						$scope.chartData = {
							title: {
								text: title,
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
								data: $scope.ohlc,
								name: pair,
								type: 'candlestick',
								dataGrouping: {
										units:[	['day',[1]],['week',[1]],['month',[1]],['year',[1]]	]
								}
							}],
						};
					});
				};
				
				//Update when charts data changes
				$scope.$watch('chartData', function(value) {
					if (!value) { return; }
					
					// Initiate the chartData.chart if it doesn't exist yet
					$scope.chartData.chart = $scope.chartData.chart || {};

					// use default values if nothing is specified in the given settings
					$scope.chartData.chart.renderTo = $scope.chartData.chart.renderTo || $element[0];
					if ($attrs.type) {
						$scope.chartData.chart.type = $scope.chartData.chart.type || $attrs.type; }
					if ($attrs.height) {
						$scope.chartData.chart.height = $scope.chartData.chart.height || $attrs.height; }
					if ($attrs.width) {
						$scope.chartData.chart.width = $scope.chartData.chart.type || $attrs.width; }

					$scope.chartObj = new Highcharts.StockChart($scope.chartData);
				});
			}
		};
	});
})();