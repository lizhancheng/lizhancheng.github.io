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
		setTimeout(drawCurtain, 10);
		// drawCurtain();
	}

	function drawRainbow() {
		var width = +ctx.canvas.width;
		var height = +ctx.canvas.height;

		var gradient = ctx.createLinearGradient(0, 0, 0, height);
		// let gradient = ctx.createRadialGradient(100,100,100,100,100,0);
		gradient.addColorStop(0, 'red');
		gradient.addColorStop(0.25, 'green');
		gradient.addColorStop(0.5, 'blue');
		gradient.addColorStop(0.75, 'yellow');
		gradient.addColorStop(1, 'white');

		ctx.beginPath();
		ctx.moveTo(0, height);
		ctx.bezierCurveTo(width / 2, 30, width / 2, height / 2, width, height);
		ctx.lineWidth = 30;
		ctx.strokeStyle = gradient;
		ctx.stroke();
	}
	drawRainbow();

	// drawCurtain();
})();