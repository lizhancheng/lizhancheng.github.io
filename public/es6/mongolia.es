/**
 * Created By zhancheng.li in 2015/11/05
 */

 	'use strict';

 	(() => {

 		let cas = document.getElementById('mongolia');

 		try {
 			var ctx = cas.getContext('2d');
 		}catch (e) {
 			console.log(e);
 		}

 		let GLOBAL = {
 			VANISH: false
 		};

 		try {
	 		ctx.canvas.width = document.documentElement.clientWidth;
	 		ctx.canvas.height = document.documentElement.clientHeight;
	 	}catch (e) {
	 		console.log(e);
	 	}

 		function drawMongolia() {

 			let [width, height] = [+ctx.canvas.width, +ctx.canvas.height];

 			/*ctx.fillStyle = "#ccc";
 			ctx.fillRect(0, 0, width, height);
 			ctx.stroke();*/

 			var img = [], len = img.length;
 			var source = [];
 			if(width > 800) {
 				source.push('../public/images/background.jpg');
 				source.push('../public/images/face_mongo.png');
 			}else {
 				source.push('../public/images/background.png');
 			}
 			for(let value of source) {
 				len = img.length;
	 			img[len] = new Image();
	 			img[len].src = value;

	 			img[len].onload = (len) => {

	 				// return () => {  // 这里babel解析报错
		 				let [imgWidth, imgHeight] = [img[len].width, img[len].height];
		 				if(!/background/.test(value)) {
		 				console.log(imgWidth, imgHeight);
		 					ctx.drawImage(img[len], (width - imgWidth) * 0.5, height * 0.08, imgWidth, imgHeight);
		 				}else {
				 			ctx.drawImage(img[len], 0, 0, width, height);
			 			}
		 			// }(len)
	 			};
 			}
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
					if(!GLOBAL.VANISH) {
						vanish();
						GLOBAL.VANISH = !GLOBAL.VANISH;
					}
 				}else if(event.type === 'touchmove') {
 					[x, y] = [
	 					event.targetTouches[0].pageX || event.targetTouches[0].clientX, 
	 					event.targetTouches[0].pageY || event.targetTouches[0].clientY
 					];
					if(!GLOBAL.VANISH) {
						vanish();
						GLOBAL.VANISH = !GLOBAL.VANISH;
					}
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
 			function vanish() {
 				
 				let mongo = document.getElementById('mongolia');
 				// mongo.classList.add('hide');
 				setTimeout(function() {

	 				mongo.style.display = "none";
 				}, 9000);
 			}

 			if(window.attachEvent) {
 				eventList('attachEvent');
 			}else if(window.addEventListener) {
 				eventList('addEventListener');
 			}
 		}

 		try {
	 		drawMongolia();
	 		initEvent();
	 	} catch (e) {
	 		console.log(e);
	 	}

 	})();