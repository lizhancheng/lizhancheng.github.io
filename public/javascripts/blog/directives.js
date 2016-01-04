/**
 * CREATED BY ZHANCHENG.LI IN 2015/12/08
 */

'use strict';

define(['app'], function (app) {

	'use strict';
	app.directive('desktop', function () {
		return {
			restrict: 'ECMA',
			controller: 'MenuCtrl',
			link: function link($scope, element, attr) {
				element.bind('click', function (event) {
					if ($scope.menu[0].display === true) {
						document.querySelector('li:first-child img').click();
					}
				});
			}
		};
	}).directive('musicBox', function () {
		return {
			restrict: 'ECMA',
			controller: 'MusicCtrl',
			link: function link($scope, element, attr) {
				$scope.loop = function (au) {
					var width = $scope.progress(au);
					angular.element(progress).css('width', width);
					$scope.flag = setTimeout(function () {
						$scope.loop(au);
					}, 1000);
					if (parseInt(width) === 96) {
						clearTimeout($scope.flag);
					}
				};
				$scope.moveBox = function (event) {
					function onMove(evt) {
						var parent = document.querySelector('.music-box');
						var targetStyle = getComputedStyle(parent) || parent.currentStyle;
						var currentLeft = parseInt(targetStyle.left);
						var currentTop = parseInt(targetStyle.top);
						var finalLeft = currentLeft + evt.movementX;
						var finalTop = currentTop + evt.movementY;

						console.log(finalLeft);
						angular.element(parent).css({ left: finalLeft + 'px', top: finalTop + 'px' });
					}
					var target = angular.element(event.target);
					target.css('cursor', 'move');
					target.on('mousemove', onMove);
				};
				$scope.stopBox = function (event) {
					var target = angular.element(event.target);
					target.css('cursor', 'default');
					target.off('mousemove');
				};

				var play = document.querySelector('.play');
				var au = document.querySelector('.audio');
				var progress = document.querySelector('.progress');
				angular.element(play).bind('click', function (event) {
					$scope.state(au);
					$scope.loop(au);
				});
			}
		};
	});
});