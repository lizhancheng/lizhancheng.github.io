({
	"baseUrl": "./javascripts", 
	"mainConfigFile": "javascripts/blog/main.js", 
	"paths": {
		/*"domReady": 'libs/requirejs-domready/domReady', 
		"angular": 'libs/angularjs/angular', 
		"angular-route": 'libs/angular-route/angular-route', 
		"angular-ui-router": 'libs/angular-ui-router/angular-ui-router.min', 
		"angularAMD": 'libs/angularAMD/angularAMD', 
		"angular-animate": 'libs/angular-animate/angular-animate.min', */
		"domReady": 'empty:', 
		"angular": 'empty:', 
		"angular-route": 'empty:', 
		"angular-ui-router": 'empty:', 
		"angularAMD": 'empty:', 
		"angular-animate": 'empty:', 
		"zUtil": 'libs/zencommon/zen', 
	}, 
	"dir": "./build", 
	"modules": [
		// {"name": "components/editor"}, 
		// {"name": "components/photo"}, 
		// {"name": "components/window"}, 
	], 
	"optimize": "uglify", 
	"optimizeCss": "standard", 
	// "skipDirOptimize": true 
});