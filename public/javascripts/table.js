'use strict'

var app = angular.module('forex.table', ['ngRoute','routeStyles'])

.config(['$routeProvider',function($routeProvider) {
	$routeProvider.when('/table', {
		templateUrl: '/partials/table',
		controller: 'TableCtrl',
		css: '/stylesheets/table.css'
	});
}]);

var TableCtrl = function($scope) {
	var _this = this;
	
	$scope.currencies = ['aud','cad','chf','eur','gbp','jpy','nzd'];
	
};

TableCtrl.$inject = ['$scope'];

app.controller('TableCtrl',TableCtrl);