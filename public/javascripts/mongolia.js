/**
 * Created By zhancheng.li in 2015/11/05
 */

'use strict';

(function () {

  var cas = document.getElementById('mongolia');

  try {
    var ctx = cas.getContext('2d');
  } catch (e) {
    console.log(e);
  }

  var GLOBAL = {
    VANISH: false
  };

  try {
    ctx.canvas.width = document.documentElement.clientWidth;
    ctx.canvas.height = document.documentElement.clientHeight;
  } catch (e) {
    console.log(e);
  }

  function drawMongolia() {
    var width = +ctx.canvas.width;
    var height = +ctx.canvas.height;

    /*ctx.fillStyle = "#ccc";
    ctx.fillRect(0, 0, width, height);
    ctx.stroke();*/

    var img = [],
        len = img.length;
    var source = [];
    if (width > 800) {
      source.push('../public/images/background.jpg');
      source.push('../public/images/face_mongo.png');
    } else {
      source.push('../public/images/background.png');
    }
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      var _loop = function () {
        var value = _step.value;

        len = img.length;
        img[len] = new Image();
        img[len].src = value;

        img[len].onload = function (len) {

          return (function () {
            // 这里babel解析报错
            var imgWidth = img[len].width;
            var imgHeight = img[len].height;

            if (!/background/.test(value)) {
              console.log(imgWidth, imgHeight);
              ctx.drawImage(img[len], (width - imgWidth) * 0.5, height * 0.08, imgWidth, imgHeight);
            } else {
              ctx.drawImage(img[len], 0, 0, width, height);
            }
          })(len);
        };
      };

      for (var _iterator = source[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        _loop();
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator['return']) {
          _iterator['return']();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
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

        if (!GLOBAL.VANISH) {
          vanish();
          GLOBAL.VANISH = !GLOBAL.VANISH;
        }
      } else if (event.type === 'touchmove') {
        x = event.targetTouches[0].pageX || event.targetTouches[0].clientX;
        y = event.targetTouches[0].pageY || event.targetTouches[0].clientY;

        if (!GLOBAL.VANISH) {
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
      startX = x;
      startY = y;
    }
    function eventList(eventType) {
      cas[eventType]('mousedown', down);
      cas[eventType]('mousemove', move);
      cas[eventType]('touchstart', down);
      cas[eventType]('touchmove', move);
    }
    function vanish() {

      var mongo = document.getElementById('mongolia');
      // mongo.classList.add('hide');
      setTimeout(function () {

        mongo.style.display = "none";
      }, 9000);
    }

    if (window.attachEvent) {
      eventList('attachEvent');
    } else if (window.addEventListener) {
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