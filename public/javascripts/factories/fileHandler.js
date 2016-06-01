'use strict'

angular.module('forex.factories')

.factory('fileHandler', function($http) {
	return {
		read: function(pair) {
			return $http.get("/readfromfile/"+pair);
		}
	};		
});