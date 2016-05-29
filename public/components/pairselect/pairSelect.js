'use strict'

var pairSelectCtrl = function(pairObjFactory) {
		var ctrl = this;
		ctrl.currencies=['AUD','CAD','CHF','EUR','GBP','JPY','NZD','USD'];
		ctrl.pairs=[];
		for (var i=0; i<ctrl.currencies.length-1; i++) {
			for (var j=0; j<ctrl.currencies.length-1; j++) {
				if (i != j) {
					ctrl.pairs.push(ctrl.currencies[i]+ctrl.currencies[j]);
				}
			}
		}
		ctrl.pair = ctrl.pairs[0];
		
		ctrl.setDates = function() {
			var pairObj = new pairObjFactory.pairObj(ctrl.pair);
			pairObj.setDates().finally(function() {
				ctrl.dbStartDateObj = new Date(pairObj.dbStartDate);
				ctrl.dbEndDateObj = new Date(pairObj.dbEndDate);
			});
		};	
		
		ctrl.update = function(pair) {
			ctrl.pair = pair;
			ctrl.setDates();
		};
	};

angular.module('forex').component('pairSelect', {
	bindings: {
		pair: '=',
		dbStartDateObj: '=',
		dbEndDateObj: '='
	},
	controller: pairSelectCtrl,
	templateUrl: '/components/pairselect/pair-select.html'
});

pairSelectCtrl.$inject = ['pairObjFactory'];