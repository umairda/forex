'use strict'

angular.module('forex')

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
		read: function(urlArray) {
			return $http.get("/readfromdb/"+urlArray.join('/'));
		},
		store: function(pair,_data) {
			return $http({
				method: 'GET',
				url: "/storeindb/"+pair,
				params: {data: _data}
			});
		},
		storeArray: function(pair,data_array,messages) {
			console.log(pair," file segment ", data_array.length);
			if (data_array.length>0) {
				return obj.store(pair,data_array[0]).then(function(success) {
					console.log(success);
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
				//console.log("typeof temp: ",typeof temp);
				return temp;	
			}
		}
	};	

	return obj;
});