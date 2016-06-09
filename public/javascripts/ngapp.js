'use strict';

angular.module('forex.factories', []);

angular.module('forex', [
  'ngRoute',
  'routeStyles',
  'forex.factories',
  'forex.graph',
  'forex.head',
  'forex.readAndStore',
  'forex.table'
])


