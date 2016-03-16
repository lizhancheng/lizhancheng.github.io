/**
 * CREATED BY ZHANCHENG.LI IN 2015/12/06
 */

'use strict';

define(['app', 'zUtil'], function (app, ZU) {

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
		$scope.submenus = ['draw', 'music', 'movie', 'article', 'all'];
	}]).controller('FileCtrl', ['$scope', '$location', function ($scope, $location) {
		// $location.path('/home').replace(); // 禁止后退

	}]).controller('PdfCtrl', ['$scope', function ($scope) {
		console.log('PdfCtrl loaded...');
		$scope.load = function () {
			ZU.loadFile('pdf-area', 'pdf-file', $scope.getPdf, 'pdf');
		};
		$scope.$emit('alter', { title: 'PDF Viewer', status: '已启动' });
	}]).controller('DesktopCtrl', ['$scope', function ($scope) {
		$scope.apps = [{ name: 'My Computer', image: 'ApplicationIcon', href: 'home' }, { name: 'My Store', image: 'sketch', href: 'store' }, { name: 'H5 App', image: 'HypeApp', href: 'app' }, { name: 'Affinity Photo', image: 'AppIcon4', href: 'photo' }];
	}]).controller('MusicCtrl', ['$scope', '$timeout', 'MusicList', function ($scope, $timeout, MusicList) {
		$scope.flag = undefined;
		$scope.duration = 'loading...';
		$scope.music_list = null;
		$scope.now_song = null;
		$scope.song_count = 0;
		$scope.total_song = 0;

		$scope.loadMusic = MusicList;

		$scope.nextSong = function () {
			if ($scope.song_count < $scope.total_song) {
				$scope.now_song = $scope.music_list[++$scope.song_count];
			}
		};

		$scope.prevSong = function () {
			if ($scope.song_count > 0) {
				$scope.now_song = $scope.music_list[--$scope.song_count];
			}
		};

		$scope.getTime = function (au) {
			if (au) {
				au.onloadedmetadata = function () {
					$scope.duration = ZU.makeTime(au.duration, true);
				};
			}
		};

		$scope.state = function (au) {
			!au.paused ? au.pause() : au.play();
		};

		$scope.progress = function (au) {
			$scope.duration = ZU.makeTime(au.currentTime) + '/' + $scope.duration.split('/')[1];
			return au.currentTime / au.duration * 96 + '%';
		};
		console.log('music-controller loaded...');
	}]).controller('DrawCtrl', ['$scope', '$state', function ($scope, $state) {
		console.log('draw-controller loaded...');
		// $state.transitionTo('index.music');
	}]).controller('ArticleCtrl', ['$scope', '$sce', 'ArticleList', function ($scope, $sce, AL) {
		console.log('article-controller loaded...');

		AL.getList($scope).success(function (result) {
			if (result.status === 200) {
				$scope.status = result.status;
				$scope.data = result.data || [{ title: '', content: '', display: true }];
				$scope.current_content = $scope.data[0].content;

				angular.forEach($scope.data, function (item, index) {
					item.display = false;
				});
				$scope.data[0].display = true;
			}
		});

		$scope.addNote = function () {
			$scope.data.push({
				title: '',
				content: '',
				display: false
			});
		};

		$scope.updateContent = function (index) {
			$scope.current_content = $scope.data[index].content;
			angular.forEach($scope.data, function (item, index) {
				item.display = false;
			});
			$scope.data[index].display = true;
		};

		$scope.trustAsHtml = $sce.trustAsHtml;
	}]).controller('WindowCtrl', ['$scope', function ($scope) {
		console.log('WindowCtrl loaded...');

		var coordinateX = 0;
		var coordinateY = 0;

		$scope.title = $scope.status = 'loading...';

		$scope.moveWindow = function (event) {
			var which = event.which;
			if (which) {
				var x = event.movementX;
				var y = event.movementY;

				$scope.move(x, y);
			}
		};

		$scope.$on('alter', function (event, data) {
			$scope.title = data.title;
			$scope.status = data.status;
		});
	}]).controller('PhotoCtrl', ['$scope', function ($scope) {
		console.log('PhotoCtrl loaded...');

		$scope.$emit('alter', { title: 'Photo Editor', status: '已启动' });
	}]).controller('AppCtrl', ['$scope', function ($scope) {
		console.log('AppCtrl loaded...');
	}]);
});