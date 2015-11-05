/**
 * Created By zhancheng.li in 2015/11/01
 */

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {

			var GLOBAL = {
						LEFT: 0,
						CLOUDS: [],
						NOW: new Date(),
						ALPHA: 1,
						ALPHA_STATUS: false
			};

			var cas = document.getElementById('cas');
			var ctx = cas.getContext('2d');
			ctx.canvas.width = document.documentElement.clientWidth;
			ctx.canvas.height = document.documentElement.clientHeight;

			var Cloud = (function () {
						function Cloud(x, y, width, height, image) {
									_classCallCheck(this, Cloud);

									this.x = x;
									this.y = y;
									this.width = width;
									this.height = height;
									this.image = image;

									this.update();
						}

						_createClass(Cloud, [{
									key: 'scale',
									value: function scale() {

												var self = this;
												var width = +ctx.canvas.width;
												var height = +ctx.canvas.height;

												self.y += 10;

												var percent = self.y / (height * 0.5);
												if (percent < 1) {
															percent = 1 - percent;
															var imgWidth = self.width * (2 + percent);
															var imgHeight = self.height * percent;

															ctx.drawImage(self.image, self.x, self.y, imgWidth, imgHeight);
												}
									}
						}, {
									key: 'update',
									value: function update() {

												var self = this;
												var width = +ctx.canvas.width;
												var height = +ctx.canvas.height;

												self.scale();
												if (self.y > height * 0.5) {
															self.y = -self.height;
															self.x = width * Math.random();
												}
									}
						}]);

						return Cloud;
			})();

			function drawCurtain() {

						var pixel = 50;
						var count = +ctx.canvas.width / pixel;
						var width = +ctx.canvas.width;
						var height = +ctx.canvas.height;

						ctx.clearRect(0, 0, width, height);
						if (GLOBAL.LEFT === width) {
									return false;
						}

						for (var i = 0; i < count; i++) {
									var disX = i * pixel;
									var gradient = ctx.createLinearGradient(disX + GLOBAL.LEFT, 0, disX + pixel + GLOBAL.LEFT, 0);
									gradient.addColorStop(0, '#CBC3F5');
									gradient.addColorStop(1, '#7464C7');

									ctx.fillStyle = gradient;
									ctx.fillRect(disX + GLOBAL.LEFT, 0, pixel, height - 50);
						}
						GLOBAL.LEFT++;

						// requestAnimationFrame(drawCurtain);
			}

			function drawRainbow() {
						var width = +ctx.canvas.width;
						var height = +ctx.canvas.height;

						// let gradient = ctx.createLinearGradient(0, 0, 0, height);
						var gradient = ctx.createRadialGradient(width / 2, height, width / 3.5, width / 2, height, width / 4);
						var percent = 1 / 7;

						gradient.addColorStop(percent * 0, 'red');
						gradient.addColorStop(percent * 1, 'orange');
						gradient.addColorStop(percent * 2, 'yellow');
						gradient.addColorStop(percent * 3, 'green');
						gradient.addColorStop(percent * 4, 'cyan');
						gradient.addColorStop(percent * 5, 'blue');
						gradient.addColorStop(percent * 6, 'purple');

						ctx.save();
						ctx.beginPath();
						ctx.translate(0, -height * 0.2);
						ctx.arc(width / 2, height, width / 3.7, Math.PI, 2 * Math.PI);
						if (navigator.userAgent.indexOf('Mobile') > -1) {
									ctx.lineWidth = 25;
						} else {
									ctx.lineWidth = 55;
						}
						ctx.strokeStyle = gradient;
						if (!GLOBAL.ALPHA_STATUS) {
									GLOBAL.ALPHA -= 0.005;
									if (GLOBAL.ALPHA <= 0.01) {
												GLOBAL.ALPHA_STATUS = !GLOBAL.ALPHA_STATUS;
									}
						} else {
									GLOBAL.ALPHA += 0.005;
									if (GLOBAL.ALPHA >= 0.5) {
												GLOBAL.ALPHA_STATUS = !GLOBAL.ALPHA_STATUS;
									}
						}
						ctx.globalAlpha = GLOBAL.ALPHA;
						ctx.stroke();
						ctx.closePath();
			}

			function drawGlass() {
						var width = +ctx.canvas.width;
						var height = +ctx.canvas.height;

						var gradient = ctx.createLinearGradient(0, height * 0.76, 0, height);

						gradient.addColorStop(0, '#88F7B0');
						gradient.addColorStop(1, 'green');

						ctx.fillStyle = gradient;
						ctx.fillRect(0, height * 0.76, width, height);
			}

			function drawSky() {
						var width = +ctx.canvas.width;
						var height = +ctx.canvas.height;

						var gradient = ctx.createLinearGradient(width, 0, 0, height * 0.76);

						gradient.addColorStop(0, '#09B9FF');
						gradient.addColorStop(1, 'white');

						ctx.restore();
						ctx.fillStyle = gradient;
						ctx.fillRect(0, 0, width, height * 0.76);
			}

			function drawCloud() {

						var img = new Image();
						var width = +ctx.canvas.width;
						var height = +ctx.canvas.height;

						img.src = '../public/images/cloud.png';
						img.onload = function () {

									ctx.restore();

									// let [randomX, randomY] = [width * Math.random(), height * 0.76 * Math.random() - img.height];
									if (GLOBAL.CLOUDS.length < 20 && Math.random() > 0.7) {
												var randomX = width * Math.random();
												var randomY = -img.height;

												GLOBAL.CLOUDS[GLOBAL.CLOUDS.length] = new Cloud(randomX, randomY, img.width, img.height, img);
									}
						};

						for (var i = 0; i < GLOBAL.CLOUDS.length; i++) {

									var cloud = GLOBAL.CLOUDS[i];
									cloud.update.bind(cloud)();
						}
						requestAnimationFrame(function () {
									drawSky();
									drawCloud();
									drawGlass();
									drawRainbow();
						});
			}

			function drawWindow() {
						var width = +ctx.canvas.width;
						var height = +ctx.canvas.height;

						ctx.restore();
						ctx.beginPath();
						ctx.lineWidth = 120;
						ctx.rect(0, 0, width, height);
						ctx.strokeStyle = '#aaa';
						ctx.stroke();
						ctx.closePath();

						ctx.beginPath();
						ctx.lineWidth = 100;
						ctx.rect(0, 0, width, height);
						ctx.strokeStyle = '#eee';
						ctx.stroke();
						ctx.closePath();
			}

			drawSky();
			drawCloud();
			drawGlass();
			drawRainbow();

			// drawCurtain();
})();