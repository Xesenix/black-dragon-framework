const webpack = require('./webpack.config.js')({ test: true });
// Karma configuration
module.exports = function (config) {
	//console.debug('karma config');process.abort();
	config.set({

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',


		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['jasmine', 'sinon'],


		// list of files / patterns to load in the browser
		files: [
			// require globals scripts
			{
				pattern: './node_modules/phaser-ce/build/phaser.min.js',
				included: true,
				watched: false,
			},
			{
				pattern: './node_modules/reflect-metadata/Reflect.js',
				included: true,
				watched: false,
			},
			// entry point
			{
				pattern: './src/main.test.ts',
				included: true,
				watched: false,
			}
		],


		// list of files to exclude
		exclude: [],


		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			// './src/**/*.spec.ts': ['webpack', 'sourcemap'],
			'./src/main.test.ts': ['webpack', 'coverage', 'sourcemap'],
		},


		webpack,


		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: [
			'progress',
			// 'html',
			'kjhtml',
			// 'coverage-istanbul',
			// 'istanbul',
			// 'remap-coverage'
		],


		htmlReporter: {
			outputFile: 'result.html',
			outputDir: './logs/tests',
			// Optional
			pageTitle: 'BDF Tests',
			subPageTitle: 'unit test results',
			groupSuites: true,
			useCompactStyle: false,
			useLegacyStyle: false,

			templatePath: null, // set if you moved jasmine_template.html
			focusOnFailures: true, // reports show failures on start
			namedFiles: false, // name files instead of creating sub-directories
			urlFriendlyName: true, // simply replaces spaces with _ for files/dirs
			reportName: 'report-summary-filename', // report summary filename; browser info by default

			// experimental
			preserveDescribeNesting: true, // folded suites stay folded
			foldAll: true // reports start folded (only with preserveDescribeNesting)
		},


		coverageReporter: {
			// dir: 'logs/coverage',
			reporters: [
				{ type: 'in-memory' },
				{ type: 'lcov', subdir: '.' },
				// { type: 'cobertura', subdir: '.', file: 'cobertura.txt' },
				// { type: 'lcovonly', subdir: '.', file: 'report-lcovonly.txt' },
				// { type: 'text', subdir: '.', file: 'coverage.txt' },
				// { type: 'html', subdir: './html' }
			]
		},

		remapCoverageReporter: {
			'text-summary': null,
			json: './coverage/coverage.json',
			html: './coverage/html',
			lcovonly: './coverage/lcov.info'
		},

		coverageIstanbulReporter: {
			reports: [ 'text-summary' ],
			fixWebpackSourcePaths: true
		},

		webpackMiddleware: {
			stats: 'errors-only'
		},


		// web server port
		port: 9876,


		// enable / disable colors in the output (reporters and logs)
		colors: true,


		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_DEBUG,


		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,


		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ['Chrome'],


		// fix typescript serving video/mp2t mime type
		mime: {
			'text/x-typescript': ['ts','tsx']
		},


		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: false,

		// Concurrency level
		// how many browser should be started simultaneous
		concurrency: Infinity
	})
}
