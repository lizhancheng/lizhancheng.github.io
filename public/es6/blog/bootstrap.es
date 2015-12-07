/**
 * CREATED BY ZHANCHENG.LI IN 2015/12/04
 */

	define(['require', 'app', 'angular', 'angular-route', 'angular-ui-router', 'controllers'], (require, app, angular) => {

		'use strict';
		require(['domReady!'], document => {
			app
				.config(($stateProvider, $urlRouterProvider) => {

					// $urlRouterProvider.otherwise('/default');
					$stateProvider
						.state('index', {
							url: '', 
							views: {
								'': {
									templateUrl: 'blog_template/index.html'
								}, 
								'desktop@index': {
									templateUrl: 'blog_template/desktop.html'
								}, 
								'menubar@index': {
									templateUrl: 'blog_template/menubar.html', 
									controller: 'MenuCtrl'
								}
							}
						})
				})
				
			angular.bootstrap(document, ['app']);
		});

	});