(function() {
		
	'use strict';

	angular.module('forex.factories')

	.factory('validJSON', function($http) {
		return {
			test: function(str) {
				var valid = 0;
				if (/^[\],:{}\s]*$/.test(str).replace(/\\["\\\/bfnrtu]/g, '@')
					.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
					.replace(/(?:^|:|,)(?:\s*\[)+/g, '')) {
					//the json is ok
					console.log('valid json');
					valid = 1;

				}
				else {
					//the json is not ok
					console.log('invalid json');
				}
				return valid;
			}
		};		
	});

})();