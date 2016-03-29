/**
 * CREATED BY ZHANCHENG.LI IN 2015/12/08
 */

'use strict';

define(['app', 'components/editor', 'components/photo'], function (app, CreateEditor, Photo) {

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
			// controller: 'MusicCtrl',
			link: function link($scope, element, attr, $watch) {
				function isPlay() {
					var jau = angular.element(au);
					var jplay = angular.element(play);

					if (au.autoplay) {
						au.play();
					} else {
						au.pause();
					}
					if (au.paused) {
						jplay.removeClass('pause');
					} else {
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
					if (!(target.hasClass('minimize') || target.hasClass('close'))) {
						target.css('cursor', 'move');
						target.on('mousemove', onMove);
					}
				};
				// while stop moving box, it will unbind the move event
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
					if (!(target.hasClass('minimize') || target.hasClass('close'))) {
						target.css('cursor', 'default');
						target.off('mousemove');
					}
					if ($scope.movement) {
						// stopMove();
					}
				};
				// while modify the progress manually, it will update the progress-bar
				$scope.updateProgress = function (event) {
					var x = (event.offsetX || event.layerX) / 400 * 100 + '%';
					angular.element(progress).css('width', x);
					au.currentTime = parseFloat(x) / 100 * au.duration;
					isPlay();
				};
				// choose song
				$scope.alterSong = function (event) {
					var alter_class = event.target.getAttribute('class');
					if (alter_class === 'prev') {
						$scope.prevSong();
					} else {
						$scope.nextSong();
					}
				};
				// switch auto status
				$scope.alterAuto = function (event) {
					angular.element(event.target).toggleClass('active');
					au.autoplay = !au.autoplay;
				};
				// get music list
				$scope.loadMusic.getList($scope).success(function (result) {
					if (result.status === 200) {
						$scope.music_list = result.data;
						$scope.now_song = $scope.music_list[0];
						$scope.total_song = $scope.music_list.length - 1;
					}
				});
				// watch the song changing
				$scope.$watch('now_song', function (nv, ov, $scope) {
					if (nv) {
						var jau = angular.element(au);
						var jplay = angular.element(play);

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

				angular.element(play).bind('click', function (event) {
					if (!au.readyState) {
						au.load();
					}
					$scope.state(au);
					angular.element(play).toggleClass('pause');
					// $scope.loop(au);
				});
				// prevent img tag from moving
				angular.element(banner_img).on('click mousedown', function (event) {
					event.preventDefault();
					return false;
				});
				// while time updates, it will update the progress-bar and timing
				au.ontimeupdate = function () {
					var width = $scope.progress(au);
					angular.element(progress).css('width', width);
					angular.element(document.querySelector('.timestamps')).text($scope.duration);
				};
			}
		};
	}).directive('content', function () {
		return {
			restrict: 'C',
			link: function link($scope, element, attr) {
				var textEditor = new CreateEditor('.content', '.image-file', true);
			}
		};
	}).directive('main', function () {
		return {
			restrict: 'C',
			link: function link($scope, element, attr) {}
		};
	}).directive('photo', function () {
		return {
			restrict: 'ECMA',
			link: function link($scope, element, attr) {
				new Photo('photo');
			}
		};
	}).directive('frameHeader', function () {
		return {
			restrict: 'C',
			link: function link($scope, element, attr) {
				var parent = element.parent();
				$scope.move = function (x, y) {
					var targetStyle = getComputedStyle(parent[0]) || parent[0].currentStyle;
					var left = parseInt(targetStyle.left) + x;
					var top = parseInt(targetStyle.top) + y;

					parent.css({
						left: left + 'px',
						top: top + 'px'
					});
				};
			}
		};
	}).directive('frame', function () {
		return {
			restrict: 'C',
			link: function link($scope, element, attr) {
				var $el = element;
				$scope.setScale = function () {
					$el.css({
						width: '100%',
						height: '100%'
					});
				};
			}
		};
	}).directive('pdfArea', function () {
		return {
			restrict: 'A',
			link: function link($scope, element, attr) {
				var $el = element;
				$scope.getPdf = function (html) {
					$el.html(html);
				};
				$scope.load();
			}
		};
	}).directive('mainFrame', function () {
		return {
			restrict: 'C',
			link: function link($scope, element, attr) {
				var $el = element;
				$scope.playVoice = function (event) {
					var $target = event ? event.target : null;
					var $au = $el.find('audio');
					var $index = $target.getAttribute('voice-index');

					// if($index) {
					// 	$au[$index].load();
					// 	$au[$index].play();
					// }
					$au[0].play();
					$au[1].play();
					$au[2].play();
					$au[3].play();
				};

				$el.on('animationstart webkitAnimationStart', function (event) {
					$scope.playVoice(event);
				});
			}
		};
	});
});