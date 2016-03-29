/**
 * CREATED BY ZHANCHENG.LI IN 2015/12/06
 */

	define(['app', 'zUtil'], (app, ZU) => {

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
				$scope.submenus = ['draw', 'music', 'movie', 'article', 'all'];
			}])
			.controller('FileCtrl', ['$scope', '$location', ($scope, $location) => {
				// $location.path('/home').replace(); // 禁止后退

			}])
			.controller('PdfCtrl', ['$scope', $scope => {
				console.log('PdfCtrl loaded...');
				$scope.load = () => {
					ZU.loadFile('pdf-area', 'pdf-file', $scope.getPdf, 'pdf');
				};
				$scope.$emit('alter', {title: 'PDF Viewer', status: '已启动'});
			}])
			.controller('DesktopCtrl', ['$scope', $scope => {
				$scope.apps = [
					{name: 'My Computer', image: 'ApplicationIcon', href: 'home'}, 
					{name: 'My Store', image: 'sketch', href: 'store'}, 
					{name: 'H5 App', image: 'HypeApp', href: 'app'}, 
					{name: 'Affinity Photo', image: 'AppIcon4', href: 'photo'}
				];

			}])
			.controller('MusicCtrl', ['$scope', '$timeout', 'MusicList', ($scope, $timeout, MusicList) => {
				$scope.flag = undefined;
				$scope.duration = 'loading...';
				$scope.music_list = null;
				$scope.now_song = null;
				$scope.song_count = 0;
				$scope.total_song = 0;

				$scope.loadMusic = MusicList;

				$scope.nextSong = () => {
					if($scope.song_count < $scope.total_song) {
						$scope.now_song = $scope.music_list[++ $scope.song_count];
					}
				};

				$scope.prevSong = () => {
					if($scope.song_count > 0) {
						$scope.now_song = $scope.music_list[-- $scope.song_count];
					}
				};

				$scope.getTime = au => {
					if(au) {
						au.onloadedmetadata = function() {
							$scope.duration = ZU.makeTime(au.duration, true);
						};
					}
				};

				$scope.state = au => {
					!au.paused ? au.pause() : au.play();
				};
				
				$scope.progress = au => {
					$scope.duration = `${ZU.makeTime(au.currentTime)}/${$scope.duration.split('/')[1]}`;
					return `${au.currentTime / au.duration * 96}%`;
				};
				console.log('music-controller loaded...');
			}])
			.controller('DrawCtrl', ['$scope', '$state', ($scope, $state) => {
				console.log('draw-controller loaded...');
				// $state.transitionTo('index.music');
			}])
			.controller('ArticleCtrl', ['$scope', '$sce', 'ArticleList', ($scope, $sce, AL) => {
				console.log('article-controller loaded...');

				AL.getList($scope)
				.success(result => {
					if(result.status === 200) {
						$scope.status = result.status;
						$scope.data = result.data || [{title: '', content: '', display: true}];
						$scope.current_content = $scope.data[0].content;

						angular.forEach($scope.data, (item, index) => {
							item.display = false;
						});
						$scope.data[0].display = true;
					}
				});

				$scope.addNote = () => {
					$scope.data.push({
						title: '', 
						content: '', 
						display: false
					});
				};

				$scope.updateContent = index => {
					$scope.current_content = $scope.data[index].content;
					angular.forEach($scope.data, (item, index) => {
						item.display = false;
					});
					$scope.data[index].display = true;
				};

				$scope.trustAsHtml = $sce.trustAsHtml;
			}])
			.controller('WindowCtrl', ['$scope', ($scope) => {
				console.log('WindowCtrl loaded...');

				let [coordinateX, coordinateY] = [0, 0];

				$scope.title = $scope.status = 'loading...';

				$scope.moveWindow = event => {
					let which = event.which;
					if(which) {
						let [x, y] = [event.movementX, event.movementY];
						$scope.move(x, y);
					}
				};

				$scope.$on('alter', (event, data) => {
					$scope.title = data.title;
					$scope.status = data.status;
				});
			}])
			.controller('PhotoCtrl', ['$scope', ($scope) => {
				console.log('PhotoCtrl loaded...');

				$scope.$emit('alter', {title: 'Photo Editor', status: '已启动'});
			}])
			.controller('AppCtrl', ['$scope', ($scope) => {
				console.log('AppCtrl loaded...');


			}])
			.controller('StoreCtrl', ['$scope', ($scope) => {
				console.log('StoreCtrl loaded...');

				let basedir = '../../public/voice/';
				$scope.voices = [
					{
						name: "sword", 
						path: `${basedir}sword.wav`
					}, 
					{
						name: "horse", 
						path: `${basedir}horse.wav`
					}, 
					{
						name: "laser", 
						path: `${basedir}laser.wav`
					}, 
					{
						name: "brake", 
						path: `${basedir}brake.wav`
					}
				];
			}])


	});