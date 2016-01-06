/**
 * CREATED BY ZHANCHENG.LI IN 2015/12/09
 */

'use strict';

define(['app'], function (app) {

	'use strict';
	app.factory('Menu', ['$http', function ($http) {
		return [{ name: 'start', display: false }, { name: 'file', display: false }, { name: 'pdf', display: false }];
	}]).factory('MusicList', ['$http', function ($http) {
		return {
			getList: function getList($scope) {
				var api = '/interface/music_list.json';
				return $http.get(api);
			}
		};
	}]);
});