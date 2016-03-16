/**
 * CREATED BY ZHANCHENG.LI IN 2015/12/08
 */


	define(['app', 'components/editor','components/photo'], (app, CreateEditor, Photo) => {

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
				};
			})
			.directive('musicBox', () => {
				return {
					restrict: 'ECMA', 
					// controller: 'MusicCtrl', 
					link: ($scope, element, attr, $watch) => {
						function isPlay() {
							let [jau, jplay] = [angular.element(au), angular.element(play)];
							if(au.autoplay) {
								au.play();
							}else {
								au.pause();
							}
							if(au.paused) {
								jplay.removeClass('pause');
							}else {
								jplay.addClass('pause');
							}
						}
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
						// move the music-box alternately
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
							if(!(target.hasClass('minimize') || target.hasClass('close'))){
								target.css('cursor', 'move');
								target.on('mousemove', onMove);
							}
						};
						// while stop moving box, it will unbind the move event
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
							if(!(target.hasClass('minimize') || target.hasClass('close'))){
								target.css('cursor', 'default');
								target.off('mousemove');
							}
							if($scope.movement) {
								// stopMove();
							}
						};
						// while modify the progress manually, it will update the progress-bar
						$scope.updateProgress = event => {
							let x = (event.offsetX || event.layerX) / 400 * 100 + '%';
							angular.element(progress).css('width', x);
							au.currentTime = parseFloat(x) / 100 * au.duration;
							isPlay();
						};
						// choose song
						$scope.alterSong = event => {
							let alter_class = event.target.getAttribute('class');
							if(alter_class === 'prev') {
								$scope.prevSong();
							}else {
								$scope.nextSong();
							}
						};
						// switch auto status
						$scope.alterAuto = event => {
							angular.element(event.target).toggleClass('active');
							au.autoplay = !au.autoplay;
						};
						// get music list
						$scope.loadMusic.getList($scope)
						.success(result => {
							if(result.status === 200) {
								$scope.music_list = result.data;
								$scope.now_song = $scope.music_list[0];
								$scope.total_song = $scope.music_list.length - 1;
							}
						});
						// watch the song changing
						$scope.$watch('now_song', (nv, ov, $scope) => {
							if(nv) {
								let [jau, jplay] = [angular.element(au), angular.element(play)];
								jau.children().attr('src', nv.path);
								au.load();
								isPlay();
							}
						});

						var play = document.querySelector('.play');
						var au = document.querySelector('.audio');
						var banner_img = document.querySelector('.banner img');
						var progress = document.querySelector('.progress');
						$scope.getTime(au);

						angular.element(play).bind('click', event => {
							if(!au.readyState) {
								au.load();
							}
							$scope.state(au);
							angular.element(play).toggleClass('pause');
							// $scope.loop(au);
						});
						// prevent img tag from moving
						angular.element(banner_img).on('click mousedown', event => {
							event.preventDefault();
							return false;
						});
						// while time updates, it will update the progress-bar and timing
						au.ontimeupdate = function() {
							let width = $scope.progress(au);
							angular.element(progress).css('width', width);
							angular.element(document.querySelector('.timestamps')).text($scope.duration);
						}

					}
				}
			})
			.directive('content', () => {
				return {
					restrict: 'C', 
					link: ($scope, element, attr) => {
						let textEditor = new CreateEditor('.content', '.image-file', true);
					}
				};
			})
			.directive('main', () => {
				return {
					restrict: 'C', 
					link: ($scope, element, attr) => {

					}
				};
			})
			.directive('photo', () => {
				return {
					restrict: 'ECMA', 
					link: ($scope, element, attr) => {
						new Photo('photo');
					}
				}
			})
			.directive('frameHeader', () => {
				return {
					restrict: 'C', 
					link: ($scope, element, attr) => {
						let parent = element.parent();
						$scope.move = (x, y) => {
							let targetStyle = getComputedStyle(parent[0]) || parent[0].currentStyle;
							let [left, top] = [parseInt(targetStyle.left) + x, parseInt(targetStyle.top) + y];
							parent.css({
								left: left + 'px', 
								top: top + 'px'
							});
						}
					}
				}
			})
			.directive('frame', () => {
				return {
					restrict: 'C', 
					link: ($scope, element, attr) => {
						let $el = element;
						$scope.setScale = () => {
							$el.css({
								width: '100%', 
								height: '100%'
							})
						}
					}
				}
			})
			.directive('pdfArea', () => {
				return {
					restrict: 'A', 
					link: ($scope, element, attr) => {
						let $el = element;
						$scope.getPdf = (html) => {
							$el.html(html);
						};
						$scope.load();
					}
				}
			});
	});