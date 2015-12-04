/**
 * CREATED BY ZHANCHENG.LI IN 2015/12/04
 */

	define(['require', 'app', 'angular', 'angular-route'], (require, app, angular) => {

		'use strict';
		require(['domReady!'], document => {
			app
				.controller('MenuCtrl', $scope => {
					$scope.names = ['Tom', 'Jack', 'Demo'];
				});
			angular.bootstrap(document, ['app']);
		});

	});