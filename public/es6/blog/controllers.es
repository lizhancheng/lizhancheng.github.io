/**
 * CREATED BY ZHANCHENG.LI IN 2015/12/06
 */

	define(['app'], app => {

		'use strict';

		app
			.controller('MenuCtrl', ['$scope', 'Menu', ($scope, Menu) => {

				$scope.menu = Menu;

				$scope.toggle = param => {
					angular.forEach($scope.menu, (item, index) => {
						if(item.name === param) {
							Menu[index].display = $scope.menu[index].display = !$scope.menu[index].display;
						}
					});
				};
			}])
			.controller('StartCtrl', ['$scope', $scope => {
				$scope.submenus = ['draw', 'music', 'movie', 'all'];
			}])
			.controller('FileCtrl', ['$scope', $scope => {

			}])
			.controller('PdfCtrl', ['$scope', $scope => {

			}])
			.controller('DesktopCtrl', ['$scope', 'Menu', ($scope, Menu) => {
				$scope.apps = [
					{name: 'My Computer', image: 'ApplicationIcon'}, 
					{name: 'My Store', image: 'sketch'}, 
					{name: 'H5 App', image: 'HypeApp'}, 
					{name: 'Affinity Photo', image: 'AppIcon4'}
				];

			}]);


	});