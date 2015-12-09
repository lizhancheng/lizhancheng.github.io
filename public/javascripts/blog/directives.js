/**
 * CREATED BY ZHANCHENG.LI IN 2015/12/08
 */

'use strict';

define(['app'], function (app) {

	'use strict';
	app.directive('desktop', function () {
		return {
			restrict: 'ECMA',
			controller: 'DesktopCtrl',
			link: function link($scope, element, attr) {
				element.on('click', function (event) {});
			}
		};
	});
});