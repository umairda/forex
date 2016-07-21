(function() {
	'use strict';

	var loadingCtrl = function($rootScope,$timeout) {
			var ctrl = this;
			ctrl.delay=200;
			ctrl.status='';
			ctrl.spinner='';
			ctrl.spinning=false;
			ctrl.views=['|','\/','-','\\','|','\/','-','\\'];
			//ctrl.views=['.','..','...','....','.....','......'];
			//ctrl.views=['┤','┘','┴','└','├','┌','┬','┐'];
			//ctrl.views=['.', 'o', 'O', '@', '*'];
			
			ctrl.spin = function(frame) {
				$timeout(function() {
					ctrl.spinner=ctrl.views[frame];
				},ctrl.delay).then(function() {
					if (ctrl.spinning) {
						frame++;
						if (frame === (ctrl.views.length)) { frame=0; }
						ctrl.spin(frame);
					}
					else { ctrl.spinner=''; }
				});
			};
			
			$rootScope.$on('loading:progress',function() {
				console.log('loading');
				ctrl.status='loading';
				ctrl.spinning=true;
				ctrl.spin(0);
			});
			
			$rootScope.$on('loading:finish',function() {
				console.log('finish');
				ctrl.status='';
				ctrl.spinning=false;
			});
		};

	angular.module('forex.components').component('loading', {
		bindings: {},
		controller: loadingCtrl,
		templateUrl: '/views/loading.component.html'
	});

	loadingCtrl.$inject = ['$rootScope','$timeout'];
})();