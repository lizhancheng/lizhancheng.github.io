/**
 * CREATED BY ZHANCHENG.LI IN 2016/01/25
 * @class Photo
 */

 	define('components/photo', ['app', 'zUtil', 'libs/createjs/easeljs-0.8.1.min', 'libs/createjs/preloadjs-0.6.1.min'], (app, ZU, Createjs) => {

 		'use strict';
 		class Photo {

 			constructor(casId, photos) {
 				this.canvas = document.getElementById(casId);
 				this.ctx = this.canvas.getContext('2d');
 				this.photos = photos;
 				this.stage = new createjs.Stage('photo');
 				this.containers = [];
 				this.shape = null;

 				this.init();
 			}

 			init() {
 				createjs.Ticker.timingMode = createjs.Ticker.RAF;
 				this.makeClose();

 				this.setElements();
 				this.display();
 			}

 			makeClose() {
 				let self = this;
 				let length = 10;
 				this.close = new createjs.Text('×', '20px Arial', '#fff');
 				// this.close = new createjs.Shape();
 				// this.close.graphics.f('black').r(0, 0, length, length);
 				this.close.setBounds(0, 0, length, length);

 				this.close.addEventListener('click', event => {
 					self.stage.removeChild(self.container);
 					self.stage.update();
 				});
 			}

 			setElements() {
 				let self = this;

 				var file = document.createElement('input');
 				file.type = 'file';
 				file.className = 'none';
 				file.id = 'photo-file';

 				var markname = document.createElement('input');
 				self.mark = markname;
 				markname.placeholder = '请输入水印名称，按回车结束';
 				markname.className = 'mark-name none';
 				ZU.addEvent(self.mark, 'keypress', event => {
 					if(event.keyCode === 13) {
 						let val = self.mark.value;
 						self.setWaterMark(val);
 						self.mark.value = '';
 						self.mark.className += ' none';
 					}
 				});

 				this.canvas.parentNode.insertBefore(file, this.canvas);
 				this.canvas.parentNode.insertBefore(markname, this.canvas);
 			}

 			setViewPort(width, height) {
 				this.canvas.width = width;
 				this.canvas.height = height;
 			}

 			adjustViewPort() {}

 			fillBackground(color) {
 				let [width, height] = [this.canvas.width, this.canvas.height];
 				this.ctx.fillStyle = color || '#666666';
 				this.ctx.fillRect(0, 0, width, height);
 			}

 			addToolBar(color, path) {
 				let [self, width, height] = [this, this.canvas.width, this.canvas.height];
 				let [toTop, iHeight] = [7, 5];
 				let toolPosition = [];
 				this.ctx.fillStyle = color || '#666666';
 				this.ctx.fillRect(5, 5, 25, height * 0.8);

 				let icons = [[0, 72], [240, 48], [456, 48], [72, 72]];
 				let len = icons.length;
 				let img = new Image();
 				img.src = path;

 				self.ctx.strokeStyle = '#666666';
 				ZU.addEvent(img, 'load', () => {
	 				for(let i = 0;i < len;i ++) {
	 					// To middle of the tools
	 					let movedown = (height * 0.8) / len * i + (height * 0.8) / (len * 2) - toTop + iHeight;
	 					self.ctx.drawImage(img, icons[i][0], icons[i][1], 14, 14, 12, movedown , 14, 14);
	 					// stroke rectangle to make it in the point of canvas
	 					self.ctx.rect(12, movedown, 14, 14);
	 					self.ctx.stroke();
		 			}
 				});

 				ZU.addEvent(self.canvas, 'click', (event) => {
 					let frame = document.querySelector('.frame');
 					let coordinate = [event.pageX || event.clientX, event.pageY || event.clientY];
 					let extraction = [frame.offsetLeft, frame.offsetTop];
 					let [half_width, half_height] = [self.canvas.width / 2, self.canvas.height / 2];
 					let status = self.ctx.isPointInPath(coordinate[0] - extraction[0] + half_width, coordinate[1] - extraction[1] + half_height);

 					console.log(status);
 				});
 			}

 			addTools(bgColor, color, path) {
 				let [
	 					self, 
	 					width, 
	 					height, 
	 					toTop, 
	 					iHeight, 
	 					stage, 
	 					loader, 
	 					manifest, 
	 					icons
 					] = [
		 					this, 
		 					this.canvas.width, 
		 					this.canvas.height, 
		 					7, 
		 					5, 
		 					this.stage, 
		 					new createjs.LoadQueue(false), 
		 					[{src: path, id: 'tools'}], 
		 					[[0, 72], [240, 48], [456, 48], [72, 72]]
	 					];
 				let [bg, bar] = [new createjs.Shape(), new createjs.Shape()];
 				bg.graphics.f(bgColor || '#555555').r(0, 0, width, height);
 				bar.graphics.f(color || '#666666').r(5, 5, 25, height * 0.8);
 				stage.addChild(bg);
 				stage.addChild(bar);

 				let len = icons.length;

 				loader.loadManifest(manifest);
 				loader.addEventListener('complete', () => {
 					let tools = loader.getResult('tools');
					let shape = new Array(4);

 					icons.forEach((item, index) => {
 						let movedown = (height * 0.8) / len * index + (height * 0.8) / (len * 2) - toTop + iHeight;
 						shape[index] = new createjs.Shape();

 						shape[index].graphics.bf(tools, 'no-repeat').r(item[0], item[1], 14, 14);
 						shape[index].y = movedown - item[1];
 						shape[index].x = 12 - item[0];

 						stage.addChild(shape[index]);
 					});

 					self.eventHandler(shape);
					stage.update();
 				});
 			}

 			eventHandler(shape) {
 				let [self, stage] = [this, this.stage];
 				// pencil handle
 				shape[0].addEventListener('click', evnet => {
 					self.canvas.style.cursor = 'url("../public/images/pen.ico"), auto';
 				});
 				// text handle
 				shape[1].addEventListener('click', event => {
 					self.canvas.style.cursor = 'text';
 				});
 				// image handle
 				ZU.previewImage(shape[2], 'photo-file', function(img, file) {
 					let shp = new createjs.Shape();
 					let container = new createjs.Container();

 					self.containers.push(container);

 					shp.graphics.bf(img, 'no-repeat').r(0, 0, img.width, img.height);
 					shp.$width = img.width, shp.$height = img.height;
 					shp.setBounds(0, 0, shp.$width, shp.$height);
 					container.setBounds(0, 0, shp.$width, shp.$height);

 					shp.setTransform(shp.$width / 2, shp.$height / 2, 1, 1, 0, 0, 0, shp.$width / 2, shp.$height / 2);

 					container.addChildAt(shp, 0);
 					self.moveShape(container, shp);
 					stage.addChild(container);
 					// stage.update();
 				});
 				// watermark handle
 				shape[3].addEventListener('click', event => {
 					if(!self.shape) return;
 					self.mark.className = self.mark.className.replace('none', '');
 					self.mark.focus();
 				});
 				// mousewheel to setScale
 				ZU.addEvent(self.canvas, 'mousewheel', event => {
 					if(!self.shape) return;

 					let delta = event.wheelDelta;
 					// let [sx, sy] = [self.shape.scaleX, self.shape.scaleY];
 					let [sx, sy] = [self.container.scaleX, self.container.scaleY];
 					let [width, height] = [self.shape.getBounds().width, self.shape.getBounds().height];
 					if(delta > 0) {
 						// self.shape.setTransform(self.shape.x, self.shape.y, sx + 0.2, sy + 0.2, 0, 0, 0, width / 2, height / 2);
 						self.container.scaleX = self.container.scaleY = sx + 0.2;
 					}else {
 						// self.shape.setTransform(self.shape.x, self.shape.y, sx - 0.2, sy - 0.2, 0, 0, 0, width / 2, height / 2);
 						self.container.scaleX = self.container.scaleY = sx - 0.2;
 					}
 					self.stage.update();
 				});
 			}

 			moveShape(container, shape) {
 				let [self, canvas] = [this, this.canvas];
 				let [startX, startY] = [0, 0];
 				let defaultMouse = 'default';

 				container.addEventListener('added', event => {
 					self.insertAnimate(container);
 					self.shape = shape;
 				});

 				container.addEventListener('click', event => {
 					self.container = container;
 				});

 				shape.addEventListener('click', event => {
 					self.shape = shape;
 					self.addClose(container);
 				});

 				container.addEventListener('mousedown', event => {
 					defaultMouse = canvas.style.cursor;
 					canvas.style.cursor = 'move';

 					startX = event.rawX;
 					startY = event.rawY;
 				});
 				container.addEventListener('pressup', event => {
 					canvas.style.cursor = defaultMouse;
 				});
 				container.addEventListener('pressmove', event => {
 					container.x = container.x + (event.rawX - startX);
 					container.y = container.y + (event.rawY - startY);
 					self.stage.update();

 					startX = event.rawX;
 					startY = event.rawY;
 				});

 				return self;
 			}

 			makeCenter(shape, img) {
 				let [width, height] = [this.canvas.width, this.canvas.height];
 				let [imgWidth, imgHeight] = [img.width, img.height];
 				shape.x = (width - imgWidth) / 2;
 				shape.y = (height - imgHeight) / 2;

 				return this;
 			}

 			insertAnimate(container) {
 				let self = this;
 				let [width, height] = [this.canvas.width, this.canvas.height];
 				let [cWidth, cHeight] = [container.getBounds().width, container.getBounds().height];
 				let flag = false;
 				let [centerX, centerY] = [(width - cWidth) / 2, (height - cHeight) / 2];
 				container.scaleX = container.scaleY = 0.5;

 				function setTransform() {
 					let [sx, sy] = [container.scaleX, container.scaleY];
 					if(sx <= 0.5) {
 						flag = true;
 					}
 					if(flag) {
 						sx = sx + 0.05, sy = sy + 0.05;
 					}else {
 						sx = sx - 0.05, sy = sy - 0.05;
 					}

 					container.setTransform(width / 2, height / 2, sx, sy, 0, 0, 0, cWidth / 2, cHeight / 2);
 					self.stage.update();
 					if(flag && sx >= 1) return;
 					requestAnimationFrame(setTransform);
 				}
 				setTransform();
 			}

 			setWaterMark(value) {

 				function randomColor() {
 					return Math.floor(Math.random() * 255);
 				}

 				let self = this;
 				let shape = self.shape;
 				if(!self.container) return;
 				let font = Math.random() + 16 + 'px Arial';
 				
 				let fill = `rgb(${randomColor()}, ${randomColor()}, ${randomColor()})`;
 				let text = new createjs.Text(value, font, fill);
 				text.alpha = Math.random();
 				text.setTransform(Math.random() * self.getScale(shape)[0], Math.random() * self.getScale(shape)[1], 1, 1, Math.random()* 1080);
 				self.container.addChild(text);
 				self.stage.update();
 			}

 			getScale(shape) {
 				let [width, height] = [shape.getBounds().width, shape.getBounds().height];
 				return [width, height];
 			}

 			addClose(container) {
 				let self = this;
 				let containers = this.containers;
 				let [width, height] = self.getScale(self.shape);

 				containers.forEach((item, index) => {
 					item.removeChildAt(1);
 				});

 				self.close.setTransform(width);
 				container.addChildAt(self.close, 1);
 				this.stage.update();
 			}

 			download() {
 				var type = 'png';
				var imgData = document.querySelector('#canvas').toDataURL(type);
				/**
				 * GET mimeType
				 * @param  {String} type the old mime-type
				 * @return the new mime-type
				 */
				var _fixType = function(type) {
				    type = type.toLowerCase().replace(/jpg/i, 'jpeg');
				    var r = type.match(/png|jpeg|bmp|gif/)[0];
				    return 'image/' + r;
				};
				   
				// 加工image data，替换mime type
				imgData = imgData.replace(_fixType(type),'image/octet-stream');
				/**
				 * 在本地进行文件保存
				 * @param  {String} data     要保存到本地的图片数据
				 * @param  {String} filename 文件名
				 */
				var saveFile = function(data, filename){
				    var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
				    save_link.href = data;
				    save_link.download = filename;
				   
				    var event = document.createEvent('MouseEvents');
				    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
				    save_link.dispatchEvent(event);
				};
				   
				// 下载后的问题名
				var filename = 'DIY_' + (new Date()).getTime() + '.' + type;
				// download
				saveFile(imgData,filename);
 			}

 			display() {
 				let self = this;

 				self.addTools(false, false, '../public/images/icons.png');
 				setTimeout(function() {
 					console.log(self.stage.toDataURL());
 				}, 10000);
 				/*self.fillBackground('#555');
 				self.addToolBar(false, '../public/images/icons.png');*/
 			}
 		}

 		return Photo;
 	});