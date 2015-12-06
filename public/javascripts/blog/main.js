/*
 * Created By zhancheng.li in 2015/11/09
 */
"use strict";

requirejs.config({
	"baseUrl": '../public/javascripts/',
	"paths": {
		"domReady": 'libs/requirejs-domready/domReady',
		"angular": 'libs/angularjs/angular',
		"angular-route": 'libs/angular-route/angular-route',
		"angular-ui-router": 'libs/angular-ui-router/angular-ui-router.min',
		"angularAMD": 'libs/angularAMD/angularAMD',
		"app": 'blog/app',
		"bootstrap": 'blog/bootstrap',
		"controllers": 'blog/controllers',
		"directives": 'blog/directives',
		"filters": 'blog/filters',
		"services": 'blog/services'
	},
	"shim": {
		"angular": {
			"exports": 'angular'
		},
		"domReady": ['angular'],
		"angular-route": {
			"deps": ['angular'],
			"exports": 'angular-route'
		},
		"angular-ui-router": {
			"deps": ['angular'],
			"exports": 'angular-ui-router'
		}

	},
	"deps": ['bootstrap'],
	"urlArgs": 'bust=' + new Date().getTime()
});
requirejs.onError = function (err) {
	console.log(err);
};