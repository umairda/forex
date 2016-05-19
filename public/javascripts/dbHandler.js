'use strict'

angular.module('forex')

.factory('dbHandler', function($http, $httpParamSerializer) {
	return {
		read: function(urlArray) {
			return $http.get("/readfromdb/"+urlArray.join('/'));
		},
		store: function(pair,_data) {
			return $http({
				method: 'GET',
				url: "/storeindb/"+pair,
				params: {data: _data}
			});
		}
	};		
});