/**
 * CREATED BY ZHANCHENG.LI IN 2015/12/04
 */

'use strict';

define(['require', 'app', 'angular', 'angular-route', 'angular-ui-router', 'services', 'controllers', 'directives'], function (require, app, angular) {

	'use strict';
	require(['domReady!'], function (document) {
		app.config(function ($stateProvider, $urlRouterProvider, $sceDelegateProvider) {

			$urlRouterProvider.otherwise('/');
			// allow cross-domain to access resource
			$sceDelegateProvider.resourceUrlWhitelist(['**']);
			$stateProvider.state('index', {
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
					'file@index': {
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
					}
				}
			}).state('index.music', {
				url: 'music-box',
				views: {
					'': {
						templateUrl: 'blog_template/start_music.html',
						controller: 'MusicCtrl'
					}
				}
			}).state('index.draw', {
				url: 'drawing',
				views: {
					'': {
						templateUrl: 'blog_template/start_draw.html',
						controller: 'DrawCtrl'
					}
				}
			});
		});

		angular.bootstrap(document, ['app']);
	});
});