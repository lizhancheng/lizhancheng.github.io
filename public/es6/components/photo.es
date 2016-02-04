/**
 * CREATED BY ZHANCHENG.LI IN 2016/01/25
 * @class Photo
 */

 	define('components/photo', ['app', 'zUtil'], (app, ZU) => {

 		'use strict';
 		class Photo {

 			constructor(casId, photos) {
 				this.canvas = document.getElementById(casId);
 				this.ctx = this.canvas.getContext('2d');
 				this.photos = photos;

 				this.init();
 			}

 			init() {
 				this.display();
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

 			display() {
 				let self = this;

 				self.fillBackground('#555');
 				self.addToolBar(false, '../public/images/icons.png');
 			}
 		}

 		return Photo;
 	});