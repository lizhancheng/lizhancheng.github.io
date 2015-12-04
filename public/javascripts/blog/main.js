/*
 * Created By zhancheng.li in 2015/11/09
 */
'use strict';

requirejs.config({
	baseUrl: '../public/javascripts/',
	paths: {
		"domReady": 'libs/requirejs-domready/domReady',
		"angular": 'libs/angularjs/angular',
		"angular-route": 'libs/angular-route/angular-route',
		"angularAMD": 'libs/angularAMD/angularAMD',
		"app": 'blog/app',
		"bootstrap": 'blog/bootstrap'
	},
	shim: {
		angular: {
			exports: 'angular'
		},
		domReady: ['angular'],
		'angular-route': {
			deps: ['angular'],
			exports: 'angular-route'
		}
	},
	deps: ['bootstrap'],
	urlArgs: 'bust=' + new Date().getTime()
});
requirejs.onError = function (err) {
	console.log(err);
};