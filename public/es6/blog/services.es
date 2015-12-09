/**
 * CREATED BY ZHANCHENG.LI IN 2015/12/09
 */

	define(['app'], app => {

		'use strict';
		app
			.factory('Menu', ['$http', $http => {
				return [
					{name: 'start', display: false}, 
					{name: 'file', display: false}, 
					{name: 'pdf', display: false}
				];
			}]);
	});