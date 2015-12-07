/**
 * CREATED BY ZHANCHENG.LI IN 2015/12/06
 */

	define(['app'], app => {

		'use strict';
		app
			.controller('MenuCtrl', ['$scope', $scope => {
				$scope.menu = ['start', 'file', 'pdf'];
			}]);
	});