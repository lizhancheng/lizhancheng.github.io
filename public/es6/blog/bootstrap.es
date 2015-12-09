/**
 * CREATED BY ZHANCHENG.LI IN 2015/12/04
 */

	define(['require', 'app', 'angular', 'angular-route', 'angular-ui-router', 'services', controllers', 'directives'], (require, app, angular) => {

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
									templateUrl: 'blog_template/desktop.html', 
									controller: 'DesktopCtrl'
								}, 
								'menubar@index': {
									templateUrl: 'blog_template/menubar.html', 
									controller: 'MenuCtrl'
								}, 
								'start@index': {
									templateUrl: 'blog_template/menu_start.html', 
									controller: 'StartCtrl'
								}, 
								'file@index': {
									templateUrl: 'blog_template/menu_file.html', 
									controller: 'FileCtrl'
								}, 
								'pdf@index': {
									templateUrl: 'blog_template/menu_pdf.html', 
									controller: 'PdfCtrl'
								}
							}
						})

				})
				
			angular.bootstrap(document, ['app']);
		});

	});