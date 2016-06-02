'use strict'

// @ pass in values as strings (one way)
// & external functions
// = two way binding for external objects

angular.module('forex').component('dateSelect', {
	bindings: {
		month: '=',
		day: '=',
		year: '=',
		control: '='
	},
	controller: function($q) {
		var ctrl = this;
		ctrl.months=[1,2,3,4,5,6,7,8,9,10,11,12];
		ctrl.years=[];
		ctrl.maxDate = 0;
		ctrl.minDate = 0;
				
		ctrl.setRange = function(dateComponent,start,end) {
			
			return $q(function(resolve,reject) {
				dateComponent = [];
				for (var i=start; i<end+1; i++) {
					dateComponent.push(i);
				}
				resolve(dateComponent);
				//console.log('dateComponent',dateComponent);
			});
		}
		
		ctrl.month = ctrl.months[0];
		ctrl.setRange(ctrl.years,1990,(new Date()).getFullYear()).then(function(dateComponent) {;
			ctrl.years = dateComponent;
			ctrl.year = ctrl.years[0];
		});
		ctrl.control.setMaxDate = ctrl.setMaxDate = function(dateObj) {
			console.log('setting max date');
			ctrl.maxDate = dateObj;
			var _maxDate = (new Date()).getFullYear();
			if (dateObj) _maxDate = ctrl.maxDate.getFullYear();
			
			return ctrl.setRange(ctrl.years,ctrl.years[0],_maxDate).then(function(dateComponent) {
				ctrl.years = dateComponent;
				console.log('ctrl.years',ctrl.years);
				ctrl.updateDaysInMonth();
			});
		}
		
		ctrl.control.setMinDate = ctrl.setMinDate = function(dateObj) {
			console.log('setting min date');
			ctrl.minDate = dateObj;
			var _minDate = 1990;
			if (dateObj) _minDate = ctrl.minDate.getFullYear();
			
			return ctrl.setRange(ctrl.years,_minDate,ctrl.years[ctrl.years.length-1]).then(function(dateComponent) {
				ctrl.years = dateComponent;
				console.log('ctrl.years',ctrl.years);
				ctrl.updateDaysInMonth();
			});
		}
		
		ctrl.control.setDate = ctrl.setDate = function(dateObj) {
			return $q(function(resolve,reject) {
				ctrl.month = dateObj.getMonth()+1;
				ctrl.day = dateObj.getDate();
				ctrl.year = dateObj.getFullYear();
				resolve(ctrl.updateDaysInMonth());
			});
		};
		
		ctrl.updateDaysInMonth = function() {
			ctrl.updateMonthsInYear().then(function(dateComponent) {
				ctrl.months = dateComponent;
			
				var maxDays = [31,28,31,30,31,30,31,31,30,31,30,31];
				if (!(ctrl.year%4)) maxDays[1]=29;
			
				var _maxDays = maxDays[ctrl.month-1]+1;
				var _minDays = 1;
			
				if (ctrl.maxDate && +ctrl.year===(ctrl.maxDate.getFullYear()) && +ctrl.month===(ctrl.maxDate.getMonth()+1)) _maxDays=ctrl.maxDate.getDate();
				else if (ctrl.minDate && +ctrl.year===(ctrl.minDate.getFullYear()) && +ctrl.month===(ctrl.minDate.getMonth()+1)) _minDays=ctrl.minDate.getDate();
				//console.log('minDays',_minDays,'maxDays',_maxDays);
				ctrl.setRange(ctrl.days,_minDays,_maxDays).then(function(dateComponent) {
					ctrl.days = dateComponent;
					if (typeof ctrl.day === 'undefined') ctrl.day = ctrl.days[0];
					else if (ctrl.day > ctrl.days[ctrl.days.length-1]) ctrl.day = ctrl.days[ctrl.days.length-1];
				});
			});
		};
		
		ctrl.updateMonthsInYear = function() {
			var _minMonth=1;
			var _maxMonth=12;
			
			if (ctrl.maxDate && +ctrl.year===(ctrl.maxDate.getFullYear())) _maxMonth = ctrl.maxDate.getMonth()+1;
			else if (ctrl.minDate && +ctrl.year===(ctrl.minDate.getFullYear())) _minMonth = ctrl.minDate.getMonth()+1;
			
			return ctrl.setRange(ctrl.months,_minMonth,_maxMonth); 
		}
		
		ctrl.updateDaysInMonth(ctrl.month,ctrl.year);
	},
	templateUrl: '/components/dateselect/date-select.html'
});