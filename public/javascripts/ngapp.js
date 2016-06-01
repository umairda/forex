'use strict';

angular.module('forex.factories', []);

angular.module('forex', [
  'ngRoute',
  'routeStyles',
  'forex.factories',
  'forex.graph',
  'forex.readAndStore',
  'forex.table'
])


