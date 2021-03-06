module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',

	client: {
		captureConsole: true,
	},
	

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      '../public/bower_components/angular/angular.js',
      '../public/bower_components/angular-route/angular-route.js',
      '../public/bower_components/angular-resource/angular-resource.js',
      '../public/bower_components/angular-mocks/angular-mocks.js',
	  '../public/bower_components/angular-route-styles/route-styles.js',
	  '../public/bower_components/angular-sanitize/angular-sanitize.js',
	  '../public/bower_components/jasmine/lib/jasmine-core/jasmine.js',	  
	  '../public/bower_components/jquery/dist/jquery.js',
	  '../public/bower_components/jasmine-jquery/lib/jasmine-jquery.js',
	  '../public/bower_components/bootstrap/dist/js/bootstrap.min.js',
	  '../public/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
	  '../public/bower_components/highcharts/highstock5.js',
	  '../public/javascripts/*.js',
	  '../public/javascripts/**/*.js',	  
	  '../public/views/*.html',
	  'unit/**/*.js',
	  {pattern: 'mock/*.json', watched: true, served: true, included: false}
    ],

    // list of files to exclude
    exclude: [],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
		"../public/views/**/*.html": ["ng-html2js"],
		"../public/views/*.html": ["ng-html2js"],		
    },

	ngHtml2JsPreprocessor: {
//		stripPrefix: "../public", 
//		prependPrefix: "/", 

		cacheIdFromPath: function(filepath) {
			var fileparts = filepath.split(/views/)
			filepath = '/views'+fileparts[1];
			console.log('filepath',filepath);
			
			return filepath;
		},
	
		moduleName: "my.templates",
	},	
	
    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO || config.LOG_DEBUG,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],
	/*
	customLaunchers: {
		Chrome: {
			base: 'Chrome',
			flags: ['--allow-file-access-from-files','--disable-web-security'],
		}
	},
	*/

	plugins: [	'karma-chrome-launcher',
				'karma-firefox-launcher',
				'karma-jasmine',
				'karma-ng-html2js-preprocessor',
				'karma-html2js-preprocessor'],
	
	junitReporter: {
		outputFile: 'test_out_unit.xml',
		suite: 'unit'
	},
	
	
    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
