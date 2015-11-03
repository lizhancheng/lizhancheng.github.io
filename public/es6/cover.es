/**
 * Created By zhancheng.li in 2015/11/01
 */

	'use strict';

	(() => {

		let GLOBAL = {
			LEFT: 0, 
			CLOUDS: [], 
			NOW: new Date()
		};

		let cas = document.getElementById('cas');
		let ctx = cas.getContext('2d');
		ctx.canvas.width = document.documentElement.clientWidth;
		ctx.canvas.height = document.documentElement.clientHeight;

		class Cloud {

			constructor(x, y, width, height, image) {

				this.x = x;
				this.y = y;
				this.width = width;
				this.height = height;
				this.image = image;

				this.update();
			}

			scale() {

				let self = this;
				let [width, height] = [+ctx.canvas.width, +ctx.canvas.height];

				self.y += 10;

				let percent = self.y / (height * 0.5);
				if(percent < 1) {
					percent = 1 - percent;
					let [imgWidth, imgHeight] = [self.width * (2 + percent), self.height * percent];
					ctx.drawImage(self.image, self.x, self.y, imgWidth, imgHeight);
				}
			}

			update() {

				let self = this;
				let [width, height] = [+ctx.canvas.width, +ctx.canvas.height];
				self.scale();
				if(self.y > height * 0.5) {
					self.y = -self.height;
					self.x = width * Math.random();
				}
			}
		}

		function drawCurtain() {

			let pixel = 50;
			let count = +ctx.canvas.width / pixel;
			let [width, height] = [+ctx.canvas.width, +ctx.canvas.height];
			ctx.clearRect(0, 0, width, height);
			if(GLOBAL.LEFT === width) {
				return false;
			}

			for(let i = 0;i < count;i ++) {
				let disX = i * pixel;
				let gradient = ctx.createLinearGradient(disX + GLOBAL.LEFT, 0, disX + pixel + GLOBAL.LEFT, 0);
				gradient.addColorStop(0, '#CBC3F5');
				gradient.addColorStop(1, '#7464C7');

				ctx.fillStyle = gradient;
				ctx.fillRect(disX + GLOBAL.LEFT, 0, pixel, height - 50);
			}
			GLOBAL.LEFT ++;

			// requestAnimationFrame(drawCurtain);
		}

		function drawRainbow() {

			let [width, height] = [+ctx.canvas.width, +ctx.canvas.height];
			// let gradient = ctx.createLinearGradient(0, 0, 0, height);
			let gradient = ctx.createRadialGradient(width / 2, height, width / 3.5, width / 2, height, width / 4);
			let percent = 1 / 7;

			gradient.addColorStop(percent * 0, 'red');
			gradient.addColorStop(percent * 1, 'orange');
			gradient.addColorStop(percent * 2, 'yellow');
			gradient.addColorStop(percent * 3, 'green');
			gradient.addColorStop(percent * 4, 'cyan');
			gradient.addColorStop(percent * 5, 'blue');
			gradient.addColorStop(percent * 6, 'purple');

			ctx.save();
			ctx.beginPath();
			ctx.translate(0, - height * 0.2);
			ctx.arc(width / 2, height, width / 3.7, Math.PI, 2 * Math.PI);
			ctx.lineWidth = 55;
			ctx.strokeStyle = gradient;
			ctx.globalAlpha = 0.5;
			ctx.stroke();
			ctx.closePath();
		}

		function drawGlass() {

			let [width, height] = [+ctx.canvas.width, +ctx.canvas.height];
			let gradient = ctx.createLinearGradient(0, height * 0.76, 0, height);

			gradient.addColorStop(0, '#88F7B0');
			gradient.addColorStop(1, 'green');

			ctx.fillStyle = gradient;
			ctx.fillRect(0, height * 0.76, width, height);
		}

		function drawSky() {

			let [width, height] = [+ctx.canvas.width, +ctx.canvas.height];
			let gradient = ctx.createLinearGradient(width, 0, 0, height * 0.76);

			gradient.addColorStop(0, '#09B9FF');
			gradient.addColorStop(1, 'white');

			ctx.restore();
			ctx.fillStyle = gradient;
			ctx.fillRect(0, 0, width, height * 0.76);

		}

		function drawCloud() {

			let img = new Image();
			let [width, height] = [+ctx.canvas.width, +ctx.canvas.height];

			img.src = '../public/images/cloud.png';
			img.onload = () => {

				ctx.restore();

				// let [randomX, randomY] = [width * Math.random(), height * 0.76 * Math.random() - img.height];
				if(GLOBAL.CLOUDS.length < 20 && Math.random() > 0.7) {
					let [randomX, randomY] = [width * Math.random(), -img.height];
					GLOBAL.CLOUDS[GLOBAL.CLOUDS.length] = new Cloud(randomX, randomY, img.width, img.height, img);
				}
			};

			for(let i = 0;i < GLOBAL.CLOUDS.length;i ++) {

				let cloud = GLOBAL.CLOUDS[i];
				cloud.update.bind(cloud)();
			}
			requestAnimationFrame(function(){
				drawSky();
				drawCloud();
				drawGlass();
				drawRainbow();
			});

		}

		function drawWindow() {

			let [width, height] = [+ctx.canvas.width, +ctx.canvas.height];

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