/**
 * CREATED BY ZHANCHENG.LI IN 2015/12/08
 */


	define(['app'], app => {

		'use strict';
		app
			.directive('desktop', () => {
				return {
					restrict: 'ECMA', 
					controller: 'MenuCtrl', 
					link: ($scope, element, attr) => {
						element.bind('click', event => {
							if($scope.menu[0].display === true) {
								document.querySelector('li:first-child img').click();
							}
						});
					}
				}
			})
			.directive('musicBox', () => {
				return {
					restrict: 'ECMA', 
					controller: 'MusicCtrl', 
					link: ($scope, element, attr) => {
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
						$scope.moveBox = event => {
							function onMove(evt) {
								let parent = document.querySelector('.music-box');
								let targetStyle = getComputedStyle(parent) || parent.currentStyle;
								let [currentLeft, currentTop] = [parseInt(targetStyle.left), parseInt(targetStyle.top)];
								let [finalLeft, finalTop] = [currentLeft + evt.movementX, currentTop + evt.movementY];
console.log(finalLeft);
								angular.element(parent).css({left: finalLeft + 'px', top: finalTop + 'px'});
							}
							var target = angular.element(event.target);
							target.css('cursor', 'move');
							target.on('mousemove', onMove);
						}
						$scope.stopBox = event => {
							var target = angular.element(event.target);
							target.css('cursor', 'default');
							target.off('mousemove');
						}

						let play = document.querySelector('.play');
						let au = document.querySelector('.audio');
						let progress = document.querySelector('.progress');
						angular.element(play).bind('click', event => {
							$scope.state(au);
							$scope.loop(au);
						});
					}
				}
			})
	});