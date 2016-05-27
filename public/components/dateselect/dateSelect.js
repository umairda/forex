'use strict'

// < one way binding
// @ input is a string
// & outputs
// = two way binding

angular.module('forex').component('dateSelect', {
	bindings: {
		month: '=',
		day: '=',
		year: '=',
	},
	controller: function() {
		var ctrl = this;
		ctrl.months=[1,2,3,4,5,6,7,8,9,10,11,12];
		ctrl.years=[];
		for (var i=1990; i<2017; i++) {
			ctrl.years.push(i);
		}
		ctrl.month = ctrl.months[0];
		ctrl.year = ctrl.years[0];
		
		ctrl.initDate = function(month,day,year) {
			ctrl.month = month;
			ctrl.day = day;
			ctrl.year = year;
			ctrl.updateDaysInMonth();
		};
		
		ctrl.updateDaysInMonth = function() {
			var maxDays = [31,28,31,30,31,30,31,31,30,31,30,31];
			if (!(ctrl.year%4)) maxDays[1]=29;
		
			var daysInMonth = [];		
			for (var i=1; i<maxDays[ctrl.month-1]+1; i++) daysInMonth.push(i);
		
			ctrl.days=daysInMonth;
			
			if (typeof ctrl.day === 'undefined') ctrl.day = ctrl.days[0];
			else if (ctrl.day > ctrl.days[ctrl.days.length-1]) ctrl.day = ctrl.days[ctrl.days.length-1];
		};
		
		ctrl.updateDaysInMonth(ctrl.month,ctrl.year);
	},
	templateUrl: '/components/dateselect/date-select.html'
});