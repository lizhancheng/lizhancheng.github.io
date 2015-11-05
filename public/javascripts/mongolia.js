/**
 * Created By zhancheng.li in 2015/11/05
 */

'use strict';

(function () {

  var cas = document.getElementById('mongolia');
  var ctx = cas.getContext('2d');

  ctx.canvas.width = document.documentElement.clientWidth;
  ctx.canvas.height = document.documentElement.clientHeight;

  function drawMongolia() {
    var width = +ctx.canvas.width;
    var height = +ctx.canvas.height;

    ctx.fillStyle = "#ccc";
    ctx.fillRect(0, 0, width, height);
    ctx.stroke();
  }

  function initEvent() {
    var startX = 0;
    var startY = 0;

    function down(event) {
      event.preventDefault();
      var x = event.x || event.pageX || event.layerX || event.targetTouches[0].pageX || event.targetTouches[0].clientX;
      var y = event.y || event.pageY || event.layerY || event.targetTouches[0].pageY || event.targetTouches[0].clientY;
      startX = x;
      startY = y;
    }
    function move(event) {
      event.preventDefault();
      var _ref = [];
      var x = _ref[0];
      var y = _ref[1];

      if (+event.which === 1) {
        x = event.x || event.pageX || event.layerX;
        y = event.y || event.pageY || event.layerY;
      } else if (event.type === 'touchmove') {
        x = event.targetTouches[0].pageX || event.targetTouches[0].clientX;
        y = event.targetTouches[0].pageY || event.targetTouches[0].clientY;
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
      startX = x;
      startY = y;
    }
    function eventList(eventType) {
      cas[eventType]('mousedown', down);
      cas[eventType]('mousemove', move);
      cas[eventType]('touchstart', down);
      cas[eventType]('touchmove', move);
    }

    if (window.attachEvent) {
      eventList('attachEvent');
    } else if (window.addEventListener) {
      eventList('addEventListener');
    }
  }

  drawMongolia();
  initEvent();
})();