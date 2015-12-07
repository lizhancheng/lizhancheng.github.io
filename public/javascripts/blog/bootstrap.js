/**
 * CREATED BY ZHANCHENG.LI IN 2015/12/04
 */

'use strict';

define(['require', 'app', 'angular', 'angular-route', 'angular-ui-router', 'controllers'], function (require, app, angular) {

	'use strict';
	require(['domReady!'], function (document) {
		app.config(function ($stateProvider, $urlRouterProvider) {

			// $urlRouterProvider.otherwise('/default');
			$stateProvider.state('index', {
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
			});
		});

		angular.bootstrap(document, ['app']);
	});
});