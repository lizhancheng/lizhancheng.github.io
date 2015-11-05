/**
 * Created By zhancheng.li in 2015/11/05
 */

 	'use strict';

 	(() => {

 		let cas = document.getElementById('mongolia');
 		let ctx = cas.getContext('2d');

 		ctx.canvas.width = document.documentElement.clientWidth;
 		ctx.canvas.height = document.documentElement.clientHeight;

 		function drawMongolia() {

 			let [width, height] = [+ctx.canvas.width, +ctx.canvas.height];

 			ctx.fillStyle = "#ccc";
 			ctx.fillRect(0, 0, width, height);
 			ctx.stroke();
 		}

 		function initEvent() {
 			let [startX, startY] = [0, 0];
 			function down(event) {
 				event.preventDefault();
 				let [x, y] = [
	 				event.x || event.pageX || event.layerX || event.targetTouches[0].pageX || event.targetTouches[0].clientX, 
	 				event.y || event.pageY || event.layerY || event.targetTouches[0].pageY || event.targetTouches[0].clientY
 				];
 				[startX, startY] = [x, y];
 			}
 			function move(event) {
  				event.preventDefault();
				var [x, y] = [];
 				if(+event.which === 1) {
	 				[x, y] = [
		 				event.x || event.pageX || event.layerX, 
		 				event.y || event.pageY || event.layerY
	 				];
 				}else if(event.type === 'touchmove') {
 					[x, y] = [
	 					event.targetTouches[0].pageX || event.targetTouches[0].clientX, 
	 					event.targetTouches[0].pageY || event.targetTouches[0].clientY
 					];
 				}
				draw(x, y);
 			}
 			function draw(x, y) {

 				ctx.beginPath();
 				ctx.globalCompositeOperation = 'destination-out';
 				ctx.moveTo(startX, startY);
 				ctx.lineTo(x, y);
 				ctx.lineWidth = 50;
 				ctx.lineCap = "round";
 				ctx.lineJoin = "round";
 				ctx.stroke();
 				ctx.closePath();
 				[startX, startY] = [x, y];
 			}
 			function eventList(eventType) {
 				cas[eventType]('mousedown', down);
 				cas[eventType]('mousemove', move);
 				cas[eventType]('touchstart', down);
 				cas[eventType]('touchmove', move);
 			}

 			if(window.attachEvent) {
 				eventList('attachEvent');
 			}else if(window.addEventListener) {
 				eventList('addEventListener');
 			}
 		}

 		drawMongolia();
 		initEvent();

 	})();