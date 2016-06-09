'use strict'

angular.module('forex.factories')

.factory('Page', function() {		
   var title = 'default';
   
   return {
     title: function() { return title; },
     setTitle: function(newTitle) { title = newTitle; }
   };	
});