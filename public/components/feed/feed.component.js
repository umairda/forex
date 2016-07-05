(function() {
	'use strict';

	var feedController = function($http,$scope) {
		var vm = this;
		
		vm.parseFeed = function(url) {
			if (typeof url === 'undefined') { url='http://rss.forexfactory.net/news/all.xml'; }
			console.log('parseFeed url',url);
			var feedUrl = 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=JSON_CALLBACK&q=' + encodeURIComponent(url);
			$http.jsonp(feedUrl).then(function(res) {
				console.log('res',res.data.responseData.feed);
				vm.feeds = res.data.responseData.feed.entries;
			}, function(error) {
				console.log(error);
				vm.feeds = 0;
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
		templateUrl:'/components/feed/feed.html',
	});
})();