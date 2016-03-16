/**
 * The directory architecture
 * - lib
 * 	 - global.js
 * 	 - jquery.min.js
 * + node_modules
 * + srcfile
 * + template
 * config.yaml
 * ma.js
 * package.json
 */
	// 'use strict';

	var http = require('http');
	var fs = require('fs');
	var nodePath = require('path');
	var url = require('url');
	var concat = require('concat');
	var uglifyjs = require('uglifyjs');
	var cleanCss = require('clean-css');
	var livereload = require('livereload');
	var YAML = require('yamljs');

	//GLOBAL variable storage 
	var GLOBAL = {
		project: [], 
		pjMap: new Map(), 
		browser: '', 
		statics: ''
	};
/**
 * Generator function through yield to control the process
 * @yield the sign of async programming
 * @return void
 */
	function* main() {	// main function entrance
		yield 'start';
		yield isExists(dist);	// copy and handle files
		yield 'end';
	}
	var it = main();
	it.next();
	
/**
 * Project detination path
 * initialize the target file or folder
 * @param null
 * @return void
 */
	function initProject() {
		dist = 'D:\\dev';
		var dirname = dist;
		if(!fs.existsSync(dirname)) {
			fs.mkdir(dirname, (data) => {
				it.next();
			});
		}else {
			it.next();
		}
		
		return dirname;
	}
/**
 * load the config of browser and statics
 * @param null
 * @return void
 */
	function loadConfig() {
		var nativeObject = YAML.load('config.yml');
		GLOBAL.browser = nativeObject.browser;
		GLOBAL.statics = nativeObject.statics;

		if(!fs.existsSync(`${dist}\\statics`)) {
			var exec = require('child_process').execSync, child;
			child = exec(`mklink /J ${dist}\\statics ${GLOBAL.statics}`);
		}
	}

/**
 * traverse file and folder
 * @param  string path: input the initial path
 * @return void
 */
	function mapFiles(path, callback) {

		if(Array.isArray(path) || path instanceof Array) {
			path.forEach((item, index) => {
				execFiles(item, callback);
			});
		}else {
			execFiles(path, callback);
		}
	}
/**
 * traverse and execute each file and folder
 * @param  string   path    : the path of file
 * @param  function callback: the function to call
 * @return void
 */
	function execFiles(path, callback) {
		// it must be sync function so that it can execute in order
		var realPath = fs.realpathSync(path);

		var stats = fs.statSync(realPath);

		if(stats.isDirectory()) {
			
			mkscript(path);
			var dir = fs.readdirSync(path);
			if(Array.isArray(dir) || dir instanceof Array) {

				dir.forEach((item, index) => {
					var hp = fs.realpathSync(`${realPath}\\${item}`);	// hard path
					var rp = `${path}\\${item}`;	// relative path
					execFiles(rp, callback);
				});
			}
		}else if(stats.isFile()) {

			callback(path);
		}
	}

/**
 * files with postfix like html, jpg, png, js, css will be handle
 * @param string filename input the filename
 * @return void
 */
	function handleFiles(filename) {

		if(filename.endsWith('html')) {
			templateHTML(filename);
		}else if(filename.endsWith('jpg') || filename.endsWith('png')) {

		}else if(filename.endsWith('.js')) {

		}else if(filename.endsWith('.css')) {
			templateCSS(filename);
		}
		saveFilePath(filename);
	}
/**
 * to save the file path like js and css
 * @param  string filename input the filename
 * @return void
 */
	function saveFilePath(filename) {

		var tempname = '';
		// to find the correct path circularly
		GLOBAL.project.forEach((item, index) => {
			var temp = new RegExp(item);
			if(filename.match(temp)) {
				tempname = item;
			}
		});
		if(!filename.match(/(source|build)\./) && !filename.match(/(pad|touch)/)) {
			if(filename.endsWith('.js')) {
				GLOBAL.pjMap.get(tempname).jsFiles.push(filename);
			}else if(filename.endsWith('.css')) {
				GLOBAL.pjMap.get(tempname).cssFiles.push(filename);
			}else if(filename.endsWith('.jpg') || filename.endsWith('.png')) {
				GLOBAL.pjMap.get(tempname).images = filename.slice(0, filename.lastIndexOf('\\'));
			}
		}
	}

// Promise method to read file
	function readFile(filename) {
		return new Promise((resolve, reject) => {
			fs.readFile(filename, 'utf8', (err, data) => {
				if(err) throw err;
				resolve(data);
			});
		});
	}
// Promise method to write file
	function writeFile(filename, data) {
		return new Promise((resolve, reject) => {
			fs.writeFile(filename, data, 'utf8', err => {
				if(err) throw err;
				resolve(`write ${filename} successfully!`);
			});
		});
	}
/**
 * deal with the html using smarty to replace
 * @param  string data the original html content
 * @return string _html the result content of html
 */
	function makeHtmlContent(data) {

		// return new Promise((resolve, reject) => {

			// Get the head of smarty
			var head = fs.readFileSync('template/header.tpl');
			// Get the foot of smarty
			var foot = fs.readFileSync('template/footer.tpl');
			// the symbol to divide the html
			if(data.indexOf('\r\n') > -1) {
				data = data.split('\r\n');
			}else if(data.indexOf('\n') > -1) {
				data = data.split('\n');
			}
			// find the content between body tag
			var _index = data.indexOf('<body>');
			data.splice(0, _index + 1);
			_index = data.indexOf('</body>');
			data.splice(_index);
			// add notes
			data.unshift('<!-- main start -->\r\n');
			data.push('<!-- main end -->\r\n');
			// remove tag body and rejoin every content
			data = data.join('\r\n');
			// 组装ma页面
			var _html = `${head}\r\n${data}\r\n${foot}`;
			_html = _html.replace(/([\w\/]*)\/(\w*\.)(png|jpg)/igm, '{$IMAGE_BASE_URL}/$2$3?v={$styleVersion}');
			return _html;

			// resolve(_html);
		// });
	}
/**
 * deal with the css file using back-end model
 * @param  string data the original css string
 * @return string data the result css string
 */
	function makeCss(data) {

		/*return new Promise((resolve, reject) => {

			data = data.replace(/url\(.*\/(\w*\.)(jpg|png)\)/igm, 'url({IMAGE_BASE_URL}/$1$2)');
			resolve(data);
		});*/
		data = data.replace(/url\(.*\/(\w*\.)(jpg|png)(.*)\)/igm, 'url({IMAGE_BASE_URL}/$1$2$3)');
		return data;
	}
/**
 * to judge whether the file is existed then decide to start copying files
 * @param  string  filename input the filename string
 * @return void
 */
	function isExists(filename) {
		// file exists
		if(!filename) return;
		// if filename were array, then make file in mass production
		if(Array.isArray(filename)) {
			filename.forEach((item, index) => {
				// var rp = fs.realpathSync(item);
				if(!fs.existsSync(item)) {
					fs.mkdirSync(item);
				}
			});
		} else {
			// var rp = fs.realpathSync(item);
			if(!fs.existsSync(filename)) {
				fs.mkdirSync(filename);
			}
			copyFile(src, dist);
		}
	}

/**
 * compare files if the original folder changed, then through time comparing to decide whether the target file's change
 * @param  string src  original folder
 * @param  string dist target folder
 * @return void
 */
	function compareFile(src, dist) {
		var filename = fs.readdirSync(src);

		GLOBAL.project = filename;

		filename.forEach((item, index) => {

			// if(item === 'lib') return;

			GLOBAL.pjMap.set(item, {jsFiles: [], cssFiles: [], images: ''});

			var build = `${dist}\\${item}`;
			var source = `${src}\\${item}`;
			if(fs.existsSync(build) && fs.statSync(build).ctime > fs.statSync(source).ctime) {
				// do nothing
				// console.log(fs.statSync(build).ctime, fs.statSync(source).ctime);
			}else {
				var exec = require('child_process').execSync, child;
				if(fs.existsSync(build)) {
					child = exec(`rd /s /q ${build}`);
					console.log(`delete the dir ${build}, and copy again...`);
				}

				fs.mkdirSync(build);
				child = exec(`xcopy /e ${source} ${build}`);
				mapFiles(build, handleFiles);
			}
		});

	}

/**
 * copy file this is the main process which will firstly load configs what it needs, then execute compareFile function. When it finished, js and css file will be compressed respectively. After that, it will create a service listening to port 8080 and open your chrome browser that you have allocated through loadConfig function. Finally, there are livereload function to reload your page automatically and watching file changes' function to inspect its all file
 * @param  string src  the original path
 * @param  string dist the target path
 * @return void
 */
	function copyFile(src, dist) {
		// 复制jquery
		if(!fs.existsSync(`${dist}\\lib`)) {
			fs.mkdirSync(`${dist}\\lib`);
			var exec = require('child_process').execSync, child;
			child = exec(`xcopy /e lib ${dist}\\lib`);
		}
		loadConfig();
		compareFile(src, dist);
		compress();
		openBrowser();
		reload();
		// zipFile();
		setTimeout(() => {
			watch();
		}, 2000);
	}
/**
 * localHTML to make index through nodejs service
 * @param  string filename the target path of index.html
 * @return void
 */
	function localHTML(filename) {
		// var file = fs.readFileSync(`${dist}\\${GLOBAL.project[0]}\\index.html`, 'utf8');
		var file = fs.readFileSync(`${dist}\\${GLOBAL.project[0]}\\index.html`, 'utf8');
		var head = fs.readFileSync('template/header-dev.tpl', 'utf8');
		var foot = fs.readFileSync('template/footer-dev.tpl', 'utf8');

		var content = file.split('\r\n');
		var _index = content.indexOf('<!-- main start -->');
		content.splice(0, _index + 1);
		_index = content.indexOf('<!-- main end -->');
		content.splice(_index);

		var _html = content.join('\r\n');
		_html = `${head}\r\n${_html}\r\n${foot}`;
		_html = _html.replace(/\{\$IMAGE_BASE_URL\}\/(.*)\?v=\{\$styleVersion\}/igm, 'resources/images/$1');
		return _html;
	}

/**
 * templateHTML to make html in smarty's style
 * @param  string filename handle the html file
 * @return void
 */
	function templateHTML(filename) {
		if(!fs.existsSync(filename)) {
			console.log(`${filename} file is not exists！`);
			return false;
		}
		var data = fs.readFileSync(filename, 'utf8');
		data = makeHtmlContent(data);
		fs.writeFileSync(filename, data, 'utf8');
		/*
		// 读写文件，模板化
		readFile(filename)
		.then( data => {
			return makeHtmlContent(data);
		})
		.then( data => {
			return writeFile(`${filename}`, data);
		})
		.then( data => {
			console.log(data);
		});*/
	}
// Temporarily useless
	function localCSS(filename) {
		var exec = require('child_process').execSync, child;
	}

/**
 * templateCSS 
 * @param  string filename to make css in back-end model
 * @return void
 */
	function templateCSS(filename) {
		if(!fs.existsSync(filename)) {
			console.log(`${filename} file is not exists！`);
			return false;
			throw new Error('error');
		}

		var data = fs.readFileSync(filename, 'utf8');
		data = makeCss(data);
		var result = fs.writeFileSync(filename, data, 'utf8');
		console.log(`write ${filename} successfully`);
		/*
		// Promise大法虽好，但还是比不起异步，速度比同步还慢
		readFile(filename)
		.then( data => {
			return makeCss(data);
		})
		.then( data => {
			return writeFile(`${filename}`, data);
		})
		.then( data => {
			console.log(data);
		});*/
	}

/**
 * found a new script file
 * @param  string filename 
 * @param  boolean mkdir
 * @return void
 */
	function mkscript(filename, mkdir) {
		// if mkdir were true, then found new file
		if(!fs.existsSync(filename) && mkdir) {
			fs.mkdirSync(filename);
			mkscript(filename);
			return false;
		}

		if(filename.split('\\').pop().match(/(resource|resources)/)) {
			// according to the existence of resources, to decide whether make javascript folder or not
			var files = fs.readdirSync(filename);
			if(files) {
				if(files.indexOf('javascript') === -1) {
					var jsdir = `${filename}\\javascript`;
					fs.mkdirSync(jsdir);
				}
				writeJs(jsdir);
			}
		}
	}
/**
 * writeJs it will create js file for programmer to write his/her js 
 * @param  string path js file path
 * @return void
 */
	function writeJs(path) {
		if(!fs.existsSync(path)) {
			mkscript(dist);
			return false;
		}
		var jsFile = `${path}\\script.js`;
		fs.openSync(jsFile, 'w+');
		console.log(`${jsFile} set up successfully!`);
	}

/**
 * compress the function to compress js and css
 * @return void
 */
	function compress() {
		
		if(GLOBAL.project.length > 0) {
			for(var i = 0;i < GLOBAL.project.length;i ++) {

				var item = GLOBAL.project[i];
				var file = GLOBAL.pjMap.get(item);

				var jsLen = file.jsFiles.length, cssLen = file.cssFiles.length;
				function condense(dir, type) {
					var basedir = `${dist}\\${item}\\resources\\${dir}`;
					var source = `${basedir}\\source.${type}`;
					var sourcemap = `${basedir}\\source.${type}.map`;
					var build = `${basedir}\\build.${type}`;

					var tempArr = [];
					tempArr = type === 'js' ? file.jsFiles : file.cssFiles;

					// js and css concat and compress separately
					concat(tempArr, source, (err) => {
						if(err) throw err;
						var result = '';

						if(type === 'js') {
							// uglify-js
							try {
								result = uglifyjs.minify([source], {
									outSourceMap: 'source.js.map'
								});
							} catch(e) {
								console.log('There is something wrong with your javascript code, please check it out!');
								throw e;
							}
							fs.writeFileSync(build, result.code, 'utf8');
							fs.writeFileSync(sourcemap, result.map, 'utf8');
						}else {
							// clean-css
							result = fs.readFileSync(source, 'utf8');
							new cleanCss().minify(result, (err, minified) => {
								
								fs.writeFileSync(build, minified.styles, 'utf8');
							});
						}

					});
				}

				if(!jsLen && !cssLen) {
					// jump out of the loop
					var tempPath = [];
					GLOBAL.project.forEach((item, index) => {
						tempPath.push(`${dist}\\${item}`);
					});
					mapFiles(tempPath, saveFilePath);
					compress();
					break;
				}

				if(jsLen) {
					// compress js
					condense('javascript', 'js');
					console.log(`${dist}\\${GLOBAL.project[0]} js to be compressed successfully!`);
				}
				if(cssLen) {
					// compress css
					condense('css', 'css');
					console.log(`${dist}\\${GLOBAL.project[0]} css to be compressed successfully!`);
				}
			}
		}else {
			var filename = [];
			filename = fs.readdirSync(dist);
			filename.forEach((item, index) => {
				GLOBAL.pjMap.set(item, {jsFiles: [], cssFiles: []});
			});
			mapFiles(filename, saveFilePath);
			compress();
		}
		// console.log('compress successfully in ' + new Date());
	}
/**
 * sleep delay function which uses while loop to stop the process
 * @param  int seconds the seconds to delay
 * @return void
 */
	function sleep(seconds) {
		var start = new Date().getTime();
		while(new Date().getTime() < start + seconds * 1000) {}
	}

/**
 * watch file-watcher
 * @return void
 */
	function watch() {
		console.log('Watching for file change...');
		var $watch = require('watch');
		$watch.watchTree(`${dist}`, (f, curr, prev) => {
		if (typeof f == "object" && prev === null && curr === null) {
	      // Finished walking the tree
	    } else if (prev === null) {
	      // f is a new file
	    } else if (curr.nlink === 0) {
	      // f was removed
	    } else {
          zipFile();
	      compress();
	      $watch.unwatchTree(`${dist}`);
	      setTimeout(watch, 1000);
	    }
	});
	}
/**
 * createService it is used for creating a nodejs server
 * @return void
 */
	function createService() {
		http.createServer((req, res) => {
			// router
			var html = localHTML(); 
			var pathname = __dirname + url.parse(req.url).pathname;
			if(nodePath.extname(pathname) === '') {
				pathname += '/';
			}
			if(pathname.charAt(pathname.length - 1) === '/') {
				pathname += 'index.html';
			}
			if(pathname.match(/\.(jpg|png|gif)/)) {
				pathname = pathname.slice(pathname.lastIndexOf('\/') + 1);
			}
			switch(nodePath.extname(pathname)) {
				case '.html': 
					res.writeHead(200, {'Content-Type': 'text/html'});
					res.write(html);
					break;
				case '.js': 
					res.writeHead(200, {'Content-Type': 'text/javascript'});
					if(pathname.indexOf('lib') > -1 && pathname.indexOf('statics') <= -1) {
						pathname = pathname.slice(pathname.lastIndexOf('lib'));
						res.write(fs.readFileSync(`${dist}\\${pathname}`));
					}else if(pathname.indexOf('statics') > -1) {
						pathname = pathname.slice(pathname.lastIndexOf('statics'));
						res.write(fs.readFileSync(`${dist}\\${pathname}`));
					}else {
						res.write(fs.readFileSync(`${dist}\\${GLOBAL.project[0]}\\${pathname.slice(pathname.search('resources'))}`), 'utf8');
					}
						// res.write(fs.readFileSync(`${dist}\\${GLOBAL.project[0]}\\${pathname.slice(pathname.search('resources'))}`), 'utf8');
					break;
				case '.css':
					res.writeHead(200, {'Content-Type': 'text/css'});
					if(pathname.indexOf('statics') > -1) {
						pathname = pathname.slice(pathname.lastIndexOf('statics'));
						res.write(fs.readFileSync(`${dist}\\${pathname}`));
					} else {
						res.write(fs.readFileSync(`${dist}\\${GLOBAL.project[0]}\\${pathname.slice(pathname.search('resources'))}`), 'utf8');
					}
					break;
				case '.gif': 
					res.writeHead(200, {'Content-Type': 'image/gif'});
					var filename = `${GLOBAL.pjMap.get(GLOBAL.project[0]).images}\\${pathname}`;
					if(fs.existsSync(filename)) {

						res.write(fs.readFileSync(filename));
					}
					// res.write(fs.readFileSync(`${GLOBAL.pjMap.get(GLOBAL.project[0]).images}\\${pathname}`, 'utf8'));
					// res.write(fs.readFileSync(`${dist}\\${GLOBAL.project[0]}\\${pathname.slice(pathname.search('resources'))}`), 'utf8');
					break;
				case '.jpg':
					res.writeHead(200, {'Content-Type': 'image/jpg'}) ;
					var filename = `${GLOBAL.pjMap.get(GLOBAL.project[0]).images}\\${pathname}`;
					if(fs.existsSync(filename)) {
						res.write(fs.readFileSync(filename));
					}
					// res.write(fs.readFileSync(`${GLOBAL.pjMap.get(GLOBAL.project[0]).images}\\${pathname}`, 'utf8'));
					// res.write(fs.readFileSync(`${dist}\\${GLOBAL.project[0]}\\${pathname.slice(pathname.search('resources'))}`), 'utf8');
					break;
				case '.png': 
					res.writeHead(200, {'Content-Type': 'image/png'});
					var filename = `${GLOBAL.pjMap.get(GLOBAL.project[0]).images}\\${pathname}`;
					if(fs.existsSync(filename)) {

						res.write(fs.readFileSync(filename));
					}
					// res.write(fs.readFileSync(`${GLOBAL.pjMap.get(GLOBAL.project[0]).images}\\${pathname}`, 'utf8'));
					// res.write(fs.readFileSync(`${dist}\\${GLOBAL.project[0]}\\${pathname.slice(pathname.search('resources'))}`), 'utf8');
					break;
				default: 
					res.writeHead(200, {'Content-Type': 'application/octet-stream'});
					break;
			}
	        res.end();  
		}).listen(8080);
	}

/**
 * openBrowser after creating the server, it will open chrome browser automatically
 * @return void
 */
	function openBrowser() {
		createService();
		var spawn = require('child_process').spawnSync;
		spawn(GLOBAL.browser, ['http://localhost:8080']);
	}
/**
 * reload using plugin livereload
 * @return void
 */
	function reload() {
		var server = livereload.createServer();
		server.watch(`${dist}\\${GLOBAL.project[0]}`);
	}

/**
 * zipFile is for zip js and css file into zip package
 * @return void
 */
	function zipFile() {
		function zipMake(type) {
			if(Array.isArray(type)) {
				type.forEach((item, index) => {
					fs.mkdirSync(`${des}\\${item}`);
					if(item === 'js' || item === 'css') {
						fs.mkdirSync(`${des}\\${item}\\pad`);
						fs.mkdirSync(`${des}\\${item}\\touch`);
					}
				})
			}
			zipCopy(['js', 'css']);
		}
		function zipCopy(type) {
			if(Array.isArray(type)) {
				type.forEach((item, index) => {
					var file_input = item === 'css' ? 'css' : 'javascript';
					var s = `${dist}\\${GLOBAL.project[0]}\\resources\\${file_input}\\build.${item}`;
					var d = ['pad', 'touch'];
					d.forEach((v, k) => {
						var val = `${des}\\${item}\\${v}\\${item}.${item}`;
						exec(`copy ${s} ${val}`);
					});
				});
			}
		}

		var zipTop = require('zip-zip-top');
		var zt = new zipTop();
		var exec = require('child_process').execSync, child;
		var des = `${dist}\\${GLOBAL.project[0]}\\activity_package`;
		if(fs.existsSync(des)) {
			exec(`rd /s /q ${des}`);
		}
		fs.mkdirSync(des);
		// copy js and css
		zipMake(['js', 'css', 'attribute', 'images', 'template']);
		zt.zipFolder(`${des}`, err => {
			if(err) throw err;
			zt.writeToFileSync(`${des}.zip`);
		});
	}

// original path and target path
	var len = process.argv.length, src, dist;
	switch(len) {
		case 2: 
			src = 'srcfile';
			dist = initProject();
			break;
		case 3: 
			src = 'srcfile';
			dist = process.argv[2];
			it.next();
			break;
		default: 
			src = process.argv[2];
			dist = process.argv[3];
			it.next();
			break;
	}
	console.log(`original path: the files in ${src} are all copied to the target path ${dist}`);

// 打开浏览器并跳转到特定的页面
/*var execFile = require('child_process').spawn, child;
child = execFile('C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe', ['www.baidu.com']);*/
/*var exec = require('child_process').exec, child;
child = exec('http-server');
var spawn = require('child_process').spawnSync;
spawn('C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe', ['http://localhost:8080']);*/
