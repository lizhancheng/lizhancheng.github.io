({
	"baseUrl": "./javascripts", 
	"mainConfigFile": "javascripts/blog/main.js", 
	"paths": {
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
		// {"name": "blog/bootstrap"}, 
		// {"name": "components/editor"}, 
		// {"name": "components/photo"}, 
		// {"name": "components/window"}, 
	], 
	"optimize": "uglify", 
	"optimizeCss": "standard", 
	// "out": "dist.js"
	// "skipDirOptimize": true 
});