(function() {

	'use strict';

	describe('feed component',function() {
	
		var $httpBackend,$scope;
		var element, feedCtrl = 0;
		var entries = [];
		var testEntries = [];
		
		beforeEach(module('forex'));
		beforeEach(module('my.templates'));
		beforeEach(inject(function($compile,$http,_$httpBackend_,$rootScope) {
			$httpBackend = _$httpBackend_;
			
			entries = [];
			var url='http://rss.forexfactory.net/news/all.xml';
			for (var i=0; i<5; i++) {
				entries.push({ title: 'title'+i, link: 'link'+i, contentSnippet: 'contentSnippet'+i, publishedDate: 'publishedDate'+i });
			}
			
			$httpBackend.when('JSONP','http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=JSON_CALLBACK&q=' + encodeURIComponent(url))
									.respond({ 
													responseData: {
														feed: {
															entries: entries
														}
													}											
									});
			
			testEntries = [];
			for (var i=0; i<2; i++) {
				testEntries.push({ title: 'title test.xml'+i, link: 'link'+i, contentSnippet: 'contentSnippet'+i, publishedDate: 'publishedDate'+i });
			}
			
			var url='http://test.xml';
			$httpBackend.when('JSONP','http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=JSON_CALLBACK&q=' + encodeURIComponent(url))
									.respond({
													responseData: {
														feed: {
															entries: testEntries
														}
													}												
									});
			

			$scope = $rootScope.$new();
			
			element = angular.element('<feed url="url"></feed>');
			element = $compile(element)($scope);
			$scope.$apply();
			feedCtrl = element.controller('feed');	
			$httpBackend.flush();
			//console.log(element);
			//console.log(feedCtrl);
		}));
	
		it("'s controller should be defined",function() {
			expect(feedCtrl).toBeDefined();
			expect(feedCtrl).not.toBe(0);
		});	
		
		it("'s feed variable should contain 5 feed objects",function() {
			expect(feedCtrl.feeds.length).toBe(entries.length);
		});
		
		it("should set all the bindings",function() {
			var findFeeds = element[0].querySelectorAll('.feed');
			for (var i=0; i<findFeeds.length; i++) {
				var findH4 = angular.element(findFeeds[i].querySelector('h4._title'));
				var findTitle = angular.element(findH4[0].querySelector('a')).text().trim();
				var findLink = findH4[0].querySelector('a').getAttribute('href');
				var findContentSnippet = angular.element(findFeeds[i].querySelector('div._content')).text().trim();
				var findPublishedDate = angular.element(findFeeds[i].querySelector('div._date')).text().trim();
				
				expect(findTitle).toBe(entries[i].title);
				expect(findLink).toBe(entries[i].link);
				expect(findContentSnippet).toBe(entries[i].contentSnippet);
				expect(findPublishedDate).toBe(entries[i].publishedDate);
			}
		});
		
		it("should watch the url variable and update the feeds variable when it changes",function() {
			expect(feedCtrl.feeds.length).toBe(entries.length);
			feedCtrl.url = 'http://test.xml';
			$scope.$apply();
			$httpBackend.flush();
			expect(feedCtrl.feeds.length).toBe(testEntries.length);
		});
	});
}());