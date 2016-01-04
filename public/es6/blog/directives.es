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
						$scope.moveBox = event => {
							function onMove(evt) {
								let parent = document.querySelector('.music-box');
								let targetStyle = getComputedStyle(parent) || parent.currentStyle;
								let [currentLeft, currentTop] = [parseInt(targetStyle.left), parseInt(targetStyle.top)];
								let [finalLeft, finalTop] = [currentLeft + evt.movementX, currentTop + evt.movementY];
								angular.element(parent).css({left: finalLeft + 'px', top: finalTop + 'px'});
								if(evt.movementX) {
									$scope.movement = true;
								}
							}
							var target = angular.element(event.target);
							target.css('cursor', 'move');
							target.on('mousemove', onMove);
						}
						$scope.stopBox = event => {
							function stopMove() {
								let parent = document.querySelector('.music-box');
								let deskTop = document.querySelector('.desktop');
								let [targetLeft, targetTop] = [angular.element(parent).css('left'), angular.element(parent).css('top')];
								let deskStyle = getComputedStyle(deskTop) || deskTop.currentStyle;
								let [left, top] = [parseFloat(targetLeft) / parseFloat(deskStyle.width) * 100, parseFloat(targetTop) / parseFloat(deskStyle.height) * 100];
								angular.element(parent).css({left: left + '%', top: top + '%'});
								$scope.movement = false;
							}
							var target = angular.element(event.target);
							target.css('cursor', 'default');
							target.off('mousemove');
							if($scope.movement) {
								// stopMove();
							}
						}

						let play = document.querySelector('.play');
						let au = document.querySelector('.audio');
						let banner_img = document.querySelector('.banner img');
						let progress = document.querySelector('.progress');
						$scope.getTime(au);

						angular.element(play).bind('click', event => {
							$scope.state(au);
							// $scope.loop(au);
						});
						// prevent img tag from moving
						angular.element(banner_img).on('click mousedown', event => {
							event.preventDefault();
							return false;
						});
						au.ontimeupdate = function() {
							let width = $scope.progress(au);
							angular.element(progress).css('width', width);
							angular.element(document.querySelector('.timestamps')).text($scope.duration);
						}

					}
				}
			})
	});