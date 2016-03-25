/**
 * CREATED BY ZHANCHENG.LI IN 2015/12/04
 */

	define(['require', 'app', 'angular', 'angular-route', 'angular-ui-router', 'services', 'controllers', 'directives'], (require, app, angular) => {

		'use strict';
		require(['domReady!'], document => {
			app
				.config(($stateProvider, $urlRouterProvider, $sceDelegateProvider) => {

					$urlRouterProvider.otherwise('/');
					// allow cross-domain to access resource
					$sceDelegateProvider.resourceUrlWhitelist(['**']);
					$stateProvider
						.state('index', {
							url: '/', 
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
								/*'file@index': {
									templateUrl: 'blog_template/menu_file.html', 
									controller: 'FileCtrl'
								}, 
								'pdf@index': {
									templateUrl: 'blog_template/menu_pdf.html', 
									controller: 'PdfCtrl'
								}, 
								'music@index': {
									templateUrl: 'blog_template/start_music.html', 
									controller: 'MusicCtrl'
								}, 
								'article@index': {
									templateUrl: 'blog_template/start_article.html', 
									controller: 'ArticleCtrl'
								}*/
							}
						})
						.state('index.music', {
							url: 'music-box', 
							views: {
								'': {
									templateUrl: 'blog_template/start_music.html', 
									controller: 'MusicCtrl'
								}
							}, 
							onEnter: () => {
								console.log('music enter...');
							}, 
							onExit: () => {
								console.log('music exit...');
							}
						})
						.state('index.draw', {
							url: 'drawing', 
							views: {
								'': {
									templateUrl: 'blog_template/start_draw.html', 
									controller: 'DrawCtrl'
								}
							}
						})
						.state('index.article', {
							url: 'article', 
							views: {
								'': {
									templateUrl: 'blog_template/start_article.html', 
									controller: 'ArticleCtrl'
								}
							}
						})
						.state('index.window', {
							abstract: true, 
							url: 'window', 
							templateUrl: 'blog_template/window.html', 
							controller: 'WindowCtrl'
						})
						.state('index.window.photo', {
							url: '/photo', 
							templateUrl: 'blog_template/photo.html', 
							controller: 'PhotoCtrl'
						})
						.state('index.window.pdf', {
							url: '/pdf', 
							templateUrl: 'blog_template/menu_pdf.html', 
							controller: 'PdfCtrl'
						})
						.state('index.window.app', {
							url: '/app', 
							templateUrl: 'blog_template/app.html', 
							controller: 'AppCtrl'
						})
						.state('index.window.store', {
							url: '/store', 
							templateUrl: 'blog_template/store.html', 
							controller: 'StoreCtrl'
						})

				});
				
			angular.bootstrap(document, ['app']);
		});

	});