(function() {

	'use strict';

	angular.module('forex.factories')

	.factory('dbHandler', function($http, $q) {
		var obj = {
			getDifference: function(pair,sdate,period) {
				var urlArray = [pair,sdate,period];
				
				return $http({
					method: 'GET',
					url: "/getDifference/"+urlArray.join('/')
				});
			},
			getDates: function(pair) {
				return $http({
					method: 'GET',
					url: '/getDates/'+pair
				});
			},
			getLast: function(pair) {
				return $http({
					method: 'GET',
					url: "/getLast/"+pair
				});
			},
			read: function(pair) {
				return $http.get("/readfromdb/"+pair);
			},
			readDatesSpecified: function(urlArray) {
				return $http.get("/readfromdb/"+urlArray.join('/'));
			},
			store: function(pair,_data) {
				return $http({
					method: 'POST',
					url: "/storeindb/"+pair,
					params: {data: _data}
				});
			},
			storeArray: function(pair,data_array,messages) {
				console.log(pair," file segment ", data_array.length);
				if (data_array.length>0) {
					return obj.store(pair,data_array[0]).then(function(success) {
						messages.push(success);
						return obj.storeArray(pair,data_array.slice(1,data_array.length),messages);
					}, function(error) {
						console.log(error);
						messages.push(error);
						return $q.reject(error);
					});
				}
				else 
				{
					var temp = $q.when(messages);
					return temp;	
				}
			}
		};	

		return obj;
	});
})();