'use strict';

requirejs.config({
	baseUrl: '../public/javascripts/',
	paths: {
		domready: 'libs/requirejs-domready/domReady',
		angular: 'libs/angularjs/angular',
		ngRoute: 'libs/angular-route/angular-route',
		angularAMD: 'libs/angularAMD/angularAMD',
		menubar: 'blog/menubar'
	},
	shim: {
		angular: {
			deps: ['domready'],
			exports: 'angular'
		},
		angularAMD: {
			deps: ['ngRoute'],
			exports: 'angularAMD'
		},
		ngRoute: {
			deps: ['angular'],
			exports: 'angular'
		}
	},
	urlArgs: 'bust=' + new Date().getTime()
});
requirejs.onError = function (err) {
	console.log(err);
};