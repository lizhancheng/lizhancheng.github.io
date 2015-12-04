/**
 * CREATED BY ZHANCHENG.LI IN 2015/12/04
 */

'use strict';

define(['require', 'app', 'angular', 'angular-route'], function (require, app, angular) {

	'use strict';
	require(['domReady!'], function (document) {
		app.controller('MenuCtrl', function ($scope) {
			$scope.names = ['Tom', 'Jack', 'Demo'];
		});
		angular.bootstrap(document, ['app']);
	});
});