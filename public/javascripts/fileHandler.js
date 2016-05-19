'use strict'

angular.module('forex')

.factory('fileHandler', function($http) {
	return {
		read: function(pair) {
			return $http.get("/readfromfile/"+pair);
		}
	};		
});