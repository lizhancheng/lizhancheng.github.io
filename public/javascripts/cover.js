/**
 * Created By zhancheng.li in 2015/11/01
 */

'use strict';

(function () {

			var GLOBAL = {
						LEFT: 0
			};

			var cas = document.getElementById('cas');
			var ctx = cas.getContext('2d');
			ctx.canvas.width = document.documentElement.clientWidth;
			ctx.canvas.height = document.documentElement.clientHeight;

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
						ctx.lineWidth = 55;
						ctx.strokeStyle = gradient;
						ctx.globalAlpha = 0.5;
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

									for (var i = 0; i < 5; i++) {
												var randomX = width * Math.random();
												var randomY = height * 0.76 * Math.random() - img.height;

												var percent = randomY / (height * 0.5);

												if (percent < 1) {

															percent = 1 - percent;
															var imgWidth = img.width;
															var imgHeight = img.height * percent;

															ctx.drawImage(img, randomX, randomY, imgWidth, imgHeight);
												}
									}
						};
			}

			drawSky();
			drawCloud();
			drawGlass();
			drawRainbow();

			// drawCurtain();
})();