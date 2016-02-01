/**
 * CREATED BY ZHANCHENG.LI IN 2015/12/09
 */

	define(['app'], app => {

		'use strict';
		app
			.factory('Menu', ['$http', $http => {
				return [
					{name: 'start', display: false}, 
					{name: 'file', display: false}, 
					{name: 'pdf', display: false}
				];
			}])
			.factory('MusicList', ['$http', $http => {
				return {
					getList: $scope => {
						let api = '/interface/music_list.json';
						return $http.get(api);
					}
				};
			}])
			.factory('ArticleList', ['$http', $http => {
				return {
					getList: $scope => {
						let api = '/interface/article_list.json';
						return $http.get(api, {cache: true});
					}
				};
			}]);
	});