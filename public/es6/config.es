requirejs.config({
	baseUrl: '../public/javascripts/', 
	paths: {
		angular: 'libs/angularjs/angular', 
		ngRoute: 'libs/angular-route/angular-route.min', 
		menubar: 'blog/menubar'
	}, 
	shim: {
		ngRoute: {
			deps: ['angular'], 
			exports: 'angular'
		}
	}, 
	urlArgs: 'bust=' + (new Date()).getTime()
});
requirejs.onError = (err) => {
	console.log(err);
}
