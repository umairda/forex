'use strict'

angular.module('forex')

.factory('splitMongoDate', function() {		
	return function(mongoDate) {
		var arr = mongoDate.split("T");
		var ymd_arr = arr[0].split("-");
		var hms_arr = arr[1].split(":");
	
		return {
			ymd:	arr[0],
			hms:	arr[1],
			year:	ymd_arr[0],
			month:	ymd_arr[1],
			day:	ymd_arr[2],
			hour:	hms_arr[0],
			minute: hms_arr[1],
			second: hms_arr[2],
			ms:		hms_arr[3]
		};	
	};		
});