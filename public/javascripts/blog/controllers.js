/**
 * CREATED BY ZHANCHENG.LI IN 2015/12/06
 */

'use strict';

define(['app'], function (app) {

	'use strict';

	app.controller('MenuCtrl', ['$scope', 'Menu', function ($scope, Menu) {

		$scope.menu = Menu;

		$scope.toggle = function (param) {
			angular.forEach($scope.menu, function (item, index) {
				if (item.name === param) {
					Menu[index].display = $scope.menu[index].display = !$scope.menu[index].display;
				}
			});
		};
	}]).controller('StartCtrl', ['$scope', function ($scope) {
		$scope.submenus = ['draw', 'music', 'movie', 'all'];
	}]).controller('FileCtrl', ['$scope', '$location', function ($scope, $location) {
		// $location.path('/home').replace(); // 禁止后退

	}]).controller('PdfCtrl', ['$scope', function ($scope) {}]).controller('DesktopCtrl', ['$scope', 'Menu', function ($scope, Menu) {
		$scope.apps = [{ name: 'My Computer', image: 'ApplicationIcon' }, { name: 'My Store', image: 'sketch' }, { name: 'H5 App', image: 'HypeApp' }, { name: 'Affinity Photo', image: 'AppIcon4' }];
	}]);
});