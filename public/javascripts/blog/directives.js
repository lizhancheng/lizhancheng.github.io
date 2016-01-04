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
				$scope.movement = false;
				/*
    // through timing to set the progress-bar
    $scope.loop = function(au) {
    	let width = $scope.progress(au);
    	angular.element(progress).css('width', width);
    	$scope.flag = setTimeout(function() {
    		$scope.loop(au);
    	}, 1000);
    	if(parseInt(width) === 96) {
    		clearTimeout($scope.flag);
    	}
    }
    */
				$scope.moveBox = function (event) {
					function onMove(evt) {
						var parent = document.querySelector('.music-box');
						var targetStyle = getComputedStyle(parent) || parent.currentStyle;
						var currentLeft = parseInt(targetStyle.left);
						var currentTop = parseInt(targetStyle.top);
						var finalLeft = currentLeft + evt.movementX;
						var finalTop = currentTop + evt.movementY;

						angular.element(parent).css({ left: finalLeft + 'px', top: finalTop + 'px' });
						if (evt.movementX) {
							$scope.movement = true;
						}
					}
					var target = angular.element(event.target);
					target.css('cursor', 'move');
					target.on('mousemove', onMove);
				};
				$scope.stopBox = function (event) {
					function stopMove() {
						var parent = document.querySelector('.music-box');
						var deskTop = document.querySelector('.desktop');
						var targetLeft = angular.element(parent).css('left');
						var targetTop = angular.element(parent).css('top');

						var deskStyle = getComputedStyle(deskTop) || deskTop.currentStyle;
						var left = parseFloat(targetLeft) / parseFloat(deskStyle.width) * 100;
						var top = parseFloat(targetTop) / parseFloat(deskStyle.height) * 100;

						angular.element(parent).css({ left: left + '%', top: top + '%' });
						$scope.movement = false;
					}
					var target = angular.element(event.target);
					target.css('cursor', 'default');
					target.off('mousemove');
					if ($scope.movement) {
						// stopMove();
					}
				};

				var play = document.querySelector('.play');
				var au = document.querySelector('.audio');
				var banner_img = document.querySelector('.banner img');
				var progress = document.querySelector('.progress');
				$scope.getTime(au);

				angular.element(play).bind('click', function (event) {
					$scope.state(au);
					// $scope.loop(au);
				});
				// prevent img tag from moving
				angular.element(banner_img).on('click mousedown', function (event) {
					event.preventDefault();
					return false;
				});
				au.ontimeupdate = function () {
					var width = $scope.progress(au);
					angular.element(progress).css('width', width);
					angular.element(document.querySelector('.timestamps')).text($scope.duration);
				};
			}
		};
	});
});