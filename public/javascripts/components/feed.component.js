(function() {
	'use strict';

	var feedController = function($http,$scope) {
		var vm = this;
		vm.feeds = 0;
		
		vm.parseFeed = function(url) {
			if (typeof url === 'undefined') { url='http://rss.forexfactory.net/news/all.xml'; }
			var feedUrl = 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=JSON_CALLBACK&q=' + encodeURIComponent(url);
			$http.jsonp(feedUrl).then(function(res) {
				vm.feeds = res.data.responseData.feed.entries;
			}, function(error) {
				console.log(error);
				vm.feeds = -1;
			});
		};
		
		vm.$onInit = function() {
			vm.parseFeed();
		};
		
		$scope.$watch(function(scope) { return vm.url; }, function(value) {
			vm.parseFeed(value);
		});
	};
	
	var app = angular.module('forex.components');

	app.component('feed',{
		bindings: {
			url: '=url',
		},
		controller:feedController,
		templateUrl:'/views/feed.component.html',
	});
})();