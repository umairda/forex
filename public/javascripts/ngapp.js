(function() {

	'use strict';

	angular.module('forex.components', []);	
	angular.module('forex.controllers', ['ngRoute','ngSanitize','routeStyles']);
	angular.module('forex.directives', []);	
	angular.module('forex.factories', []);
	angular.module('forex.services', []);
	
	angular.module('forex', [
	  'ngRoute',
	  'routeStyles',
	  'ui.bootstrap',
	  'forex.components',
	  'forex.controllers',
	  'forex.directives',
	  'forex.factories',
	  'forex.services',
	]);

})();