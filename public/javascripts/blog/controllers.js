/**
 * CREATED BY ZHANCHENG.LI IN 2015/12/06
 */

'use strict';

define(['app'], function (app) {

	'use strict';
	app.controller('MenuCtrl', ['$scope', function ($scope) {
		$scope.menu = ['start', 'file', 'pdf'];
	}]);
});