/**
 * CREATED BY ZHANCHENG.LI IN 2015/12/08
 */


	define(['app'], app => {

		'use strict';
		app
			.directive('desktop', () => {
				return {
					restrict: 'ECMA', 
					controller: 'DesktopCtrl', 
					link: ($scope, element, attr) => {
						element.on('click', event => {

						});
					}
				}
			});
	});