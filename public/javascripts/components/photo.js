/**
 * CREATED BY ZHANCHENG.LI IN 2016/01/25
 * @class Photo
 */

'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

define('components/photo', ['app', 'zUtil', 'libs/createjs/easeljs-0.8.1.min', 'libs/createjs/preloadjs-0.6.1.min'], function (app, ZU, Createjs) {

  'use strict';

  var Photo = (function () {
    function Photo(casId, photos) {
      _classCallCheck(this, Photo);

      this.canvas = document.getElementById(casId);
      this.ctx = this.canvas.getContext('2d');
      this.photos = photos;
      this.stage = new createjs.Stage('photo');
      this.containers = [];
      this.shape = null;
      this.eventFlag = false;

      this.init();
    }

    _createClass(Photo, [{
      key: 'init',
      value: function init() {
        createjs.Ticker.timingMode = createjs.Ticker.RAF;
        this.makeClose();
        this.adjustViewPort();

        this.setElements();
        this.draw();
        this.display();
      }
    }, {
      key: 'makeClose',
      value: function makeClose() {
        var self = this;
        var length = 10;
        this.close = new createjs.Text('×', '20px Microsoft YaHei', '#fff');
        this.close.name = 'close';
        // this.close = new createjs.Shape();
        // this.close.graphics.f('black').r(0, 0, length, length);
        this.close.setBounds(0, 0, length, length);

        this.close.addEventListener('click', function (event) {
          self.stage.removeChild(self.container);
          self.stage.update();
        });
      }
    }, {
      key: 'setElements',
      value: function setElements() {
        var self = this;

        var file = document.createElement('input');
        file.type = 'file';
        file.className = 'none';
        file.id = 'photo-file';

        var markname = document.createElement('input');
        self.mark = markname;
        markname.placeholder = '请输入水印名称，按回车结束';
        markname.className = 'mark-name none';
        ZU.addEvent(self.mark, 'keypress', function (event) {
          if (event.keyCode === 13) {
            var val = self.mark.value;
            self.setWaterMark(val);
            self.mark.value = '';
            self.mark.className += ' none';
          }
        });

        this.canvas.parentNode.insertBefore(file, this.canvas);
        this.canvas.parentNode.insertBefore(markname, this.canvas);
      }
    }, {
      key: 'setViewPort',
      value: function setViewPort(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
      }
    }, {
      key: 'adjustViewPort',
      value: function adjustViewPort() {
        var self = this;
        var dom = document.documentElement;

        self.canvas.width = dom.clientWidth > 640 ? 640 : dom.clientWidth * 0.6;
        self.canvas.height = dom.clientHeight > 480 ? 480 : dom.clientHeight * 0.5;
      }
    }, {
      key: 'fillBackground',
      value: function fillBackground(color) {
        var width = this.canvas.width;
        var height = this.canvas.height;

        this.ctx.fillStyle = color || '#666666';
        this.ctx.fillRect(0, 0, width, height);
      }
    }, {
      key: 'addToolBar',
      value: function addToolBar(color, path) {
        var self = this;
        var width = this.canvas.width;
        var height = this.canvas.height;
        var toTop = 7;
        var iHeight = 5;

        var toolPosition = [];
        this.ctx.fillStyle = color || '#666666';
        this.ctx.fillRect(5, 5, 25, height * 0.8);

        var icons = [[0, 72], [240, 48], [456, 48], [72, 72]];
        var len = icons.length;
        var img = new Image();
        img.src = path;

        self.ctx.strokeStyle = '#666666';
        ZU.addEvent(img, 'load', function () {
          for (var i = 0; i < len; i++) {
            // To middle of the tools
            var movedown = height * 0.8 / len * i + height * 0.8 / (len * 2) - toTop + iHeight;
            self.ctx.drawImage(img, icons[i][0], icons[i][1], 14, 14, 12, movedown, 14, 14);
            // stroke rectangle to make it in the point of canvas
            self.ctx.rect(12, movedown, 14, 14);
            self.ctx.stroke();
          }
        });

        ZU.addEvent(self.canvas, 'click', function (event) {
          var frame = document.querySelector('.frame');
          var coordinate = [event.pageX || event.clientX, event.pageY || event.clientY];
          var extraction = [frame.offsetLeft, frame.offsetTop];
          var half_width = self.canvas.width / 2;
          var half_height = self.canvas.height / 2;

          var status = self.ctx.isPointInPath(coordinate[0] - extraction[0] + half_width, coordinate[1] - extraction[1] + half_height);

          console.log(status);
        });
      }
    }, {
      key: 'addTools',
      value: function addTools(bgColor, color, path) {
        var self = this;
        var width = this.canvas.width;
        var height = this.canvas.height;
        var toTop = 7;
        var iHeight = 5;
        var stage = this.stage;
        var ctan = new createjs.Container();
        var loader = new createjs.LoadQueue(false);
        var manifest = [{ src: path, id: 'tools' }];
        var icons = [[0, 72], [240, 48], [456, 48], [72, 72], [96, 24]];

        var bar = new createjs.Shape();
        bar.graphics.f(color || '#666666').r(5, 5, 25, height * 0.8);
        ctan.addChild(bar);

        var len = icons.length;

        loader.loadManifest(manifest);
        loader.addEventListener('complete', function () {
          var tools = loader.getResult('tools');
          var shape = new Array(4);

          icons.forEach(function (item, index) {
            var movedown = height * 0.8 / len * index + height * 0.8 / (len * 2) - toTop + iHeight;
            shape[index] = new createjs.Shape();

            shape[index].graphics.bf(tools, 'no-repeat').r(item[0], item[1], 14, 14);
            shape[index].y = movedown - item[1];
            shape[index].x = 12 - item[0];

            ctan.addChild(shape[index]);
          });

          self.eventHandler(shape, ctan);
          stage.addChild(ctan);
          stage.update();
        });
      }
    }, {
      key: 'eventHandler',
      value: function eventHandler(shape, bar) {
        var self = this;
        var stage = this.stage;

        // pencil handle
        shape[0].addEventListener('click', function (evnet) {
          var mouse = 'url("../public/images/pen.ico") 0 10, auto';
          var gesture = self.canvas.style.cursor || 'default';
          self.canvas.style.cursor = gesture === mouse ? 'default' : mouse;

          self.drawStart();
        });
        // text handle
        shape[1].addEventListener('click', function (event) {
          self.canvas.style.cursor = 'text';
        });
        // image handle
        ZU.previewImage(shape[2], 'photo-file', function (img, file) {
          var shp = new createjs.Shape();
          var container = new createjs.Container();

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
        shape[3].addEventListener('click', function (event) {
          if (!self.shape) return;
          self.mark.className = self.mark.className.replace('none', '');
          self.mark.focus();
        });
        // download handle
        shape[4].addEventListener('click', function (event) {
          bar.visible = false;
          self.close.visible = false;
          self.stage.update();
          self.download();

          bar.visible = true;
          self.close.visible = true;
          self.stage.update();
        });
        // mousewheel to setScale
        ZU.addEvent(self.canvas, 'mousewheel', function (event) {
          if (!self.shape) return;

          var delta = event.wheelDelta;
          // let [sx, sy] = [self.shape.scaleX, self.shape.scaleY];
          var sx = self.container.scaleX;
          var sy = self.container.scaleY;
          var width = self.shape.getBounds().width;
          var height = self.shape.getBounds().height;

          if (delta > 0) {
            // self.shape.setTransform(self.shape.x, self.shape.y, sx + 0.2, sy + 0.2, 0, 0, 0, width / 2, height / 2);
            self.container.scaleX = self.container.scaleY = sx + 0.2;
          } else {
            // self.shape.setTransform(self.shape.x, self.shape.y, sx - 0.2, sy - 0.2, 0, 0, 0, width / 2, height / 2);
            self.container.scaleX = self.container.scaleY = sx - 0.2;
          }
          self.stage.update();
        });
      }

      /**
       * draw with pen arbitrarily
       * @return null
       * @notice this function needs to be optimized
       */
    }, {
      key: 'draw',
      value: function draw() {
        var self = this;
        var cas = self.canvas;
        var ctx = self.ctx;
        var stage = self.stage;
        var width = cas.width;
        var height = cas.height;
        var startX = 0;
        var startY = 0;
        var leftEdge = 0;
        var topEdge = 0;

        var drawFlag = false;

        function down(event) {
          if (!self.eventFlag) return;
          drawFlag = true;
          leftEdge = cas.getBoundingClientRect().left;
          topEdge = cas.getBoundingClientRect().top;
          startX = (event.clientX || event.pageX || event.touches[0].clientX || event.touches[0].pageX) - leftEdge;
          startY = (event.clientY || event.pageY || event.touches[0].clientY || event.touches[0].pageY) - topEdge;

          ctx.beginPath();
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.lineWidth = 5;
          ctx.moveTo(startX, startY);
          ctx.lineTo(startX, startY);
          ctx.strokeStyle = 'black';
          ctx.stroke();
        }
        function move(event) {
          if (drawFlag) {
            var moveX = (event.clientX || event.pageX || event.touches[0].clientX || event.touches[0].pageX) - leftEdge;
            var moveY = (event.clientY || event.pageY || event.touches[0].clientY || event.touches[0].pageY) - topEdge;

            ctx.lineTo(moveX, moveY);
            ctx.stroke();
            ctx.moveTo(moveX, moveY);
          }
        }
        function up() {
          drawFlag = false;
        }

        ZU.addEvent(cas, 'mousedown', down);
        ZU.addEvent(cas, 'touchstart', down);
        ZU.addEvent(cas, 'mousemove', move);
        ZU.addEvent(cas, 'touchmove', move);
        ZU.addEvent(cas, 'mouseup', up);
        ZU.addEvent(cas, 'touchend', up);
      }
    }, {
      key: 'drawStart',
      value: function drawStart() {
        this.eventFlag = !this.eventFlag;
      }
    }, {
      key: 'moveShape',
      value: function moveShape(container, shape) {
        var self = this;
        var canvas = this.canvas;
        var startX = 0;
        var startY = 0;

        var defaultMouse = 'default';

        container.addEventListener('added', function (event) {
          self.insertAnimate(container);
          self.shape = shape;
        });

        container.addEventListener('click', function (event) {
          self.container = container;
        });

        shape.addEventListener('click', function (event) {
          self.shape = shape;
          self.addClose(container);
        });

        container.addEventListener('mousedown', function (event) {
          defaultMouse = canvas.style.cursor;
          canvas.style.cursor = 'move';

          startX = event.rawX;
          startY = event.rawY;
        });
        container.addEventListener('pressup', function (event) {
          canvas.style.cursor = defaultMouse;
        });
        container.addEventListener('pressmove', function (event) {
          container.x = container.x + (event.rawX - startX);
          container.y = container.y + (event.rawY - startY);
          self.stage.update();

          startX = event.rawX;
          startY = event.rawY;
        });

        return self;
      }
    }, {
      key: 'makeCenter',
      value: function makeCenter(shape, img) {
        var width = this.canvas.width;
        var height = this.canvas.height;
        var imgWidth = img.width;
        var imgHeight = img.height;

        shape.x = (width - imgWidth) / 2;
        shape.y = (height - imgHeight) / 2;

        return this;
      }
    }, {
      key: 'insertAnimate',
      value: function insertAnimate(container) {
        var self = this;
        var width = this.canvas.width;
        var height = this.canvas.height;
        var cWidth = container.getBounds().width;
        var cHeight = container.getBounds().height;

        var flag = false;
        var centerX = (width - cWidth) / 2;
        var centerY = (height - cHeight) / 2;

        container.scaleX = container.scaleY = 0.5;

        function setTransform() {
          var sx = container.scaleX;
          var sy = container.scaleY;

          if (sx <= 0.5) {
            flag = true;
          }
          if (flag) {
            sx = sx + 0.05, sy = sy + 0.05;
          } else {
            sx = sx - 0.05, sy = sy - 0.05;
          }

          container.setTransform(width / 2, height / 2, sx, sy, 0, 0, 0, cWidth / 2, cHeight / 2);
          self.stage.update();
          if (flag && sx >= 1) return;
          requestAnimationFrame(setTransform);
        }
        setTransform();
      }
    }, {
      key: 'setWaterMark',
      value: function setWaterMark(value) {

        function randomColor() {
          return Math.floor(Math.random() * 255);
        }

        var self = this;
        var shape = self.shape;
        if (!self.container) return;
        var font = Math.random() + 16 + 'px Microsoft YaHei';

        var fill = 'rgb(' + randomColor() + ', ' + randomColor() + ', ' + randomColor() + ')';
        var text = new createjs.Text(value, font, fill);
        text.alpha = Math.random() + 0.3;
        text.setTransform(Math.random() * self.getScale(shape)[0], Math.random() * self.getScale(shape)[1], 1, 1, Math.random() * 1080);
        self.container.addChildAt(text, 2);
        self.stage.update();
      }
    }, {
      key: 'getScale',
      value: function getScale(shape) {
        var width = shape.getBounds().width;
        var height = shape.getBounds().height;

        return [width, height];
      }
    }, {
      key: 'addClose',
      value: function addClose(container) {
        var self = this;
        var containers = this.containers;

        var _self$getScale = self.getScale(self.shape);

        var _self$getScale2 = _slicedToArray(_self$getScale, 2);

        var width = _self$getScale2[0];
        var height = _self$getScale2[1];

        containers.forEach(function (item, index) {
          var close = item.getChildByName('close');
          item.removeChild(close);
        });

        self.close.setTransform(width);
        container.addChildAt(self.close, 1);
        this.stage.update();
      }
    }, {
      key: 'download',
      value: function download() {
        var type = 'png';
        var imgData = document.getElementById('photo').toDataURL(type);
        /**
         * GET mimeType
         * @param  {String} type the old mime-type
         * @return the new mime-type
         */
        var _fixType = function _fixType(type) {
          type = type.toLowerCase().replace(/jpg/i, 'jpeg');
          var r = type.match(/png|jpeg|bmp|gif/)[0];
          return 'image/' + r;
        };

        // reinforce image data，replace mime type
        imgData = imgData.replace(_fixType(type), 'image/octet-stream');
        /**
         * save file locally
         * @param  {String} data     the data of filestream
         * @param  {String} filename the name of file
         */
        var saveFile = function saveFile(data, filename) {
          var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
          save_link.href = data;
          save_link.download = filename;

          var event = document.createEvent('MouseEvents');
          event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
          save_link.dispatchEvent(event);
        };

        // name of file after download
        var filename = 'DIY_' + new Date().getTime() + '.' + type;
        // download
        saveFile(imgData, filename);
      }
    }, {
      key: 'display',
      value: function display() {
        var self = this;

        self.addTools(false, false, '../public/images/icons.png');
        /*self.fillBackground('#555');
        self.addToolBar(false, '../public/images/icons.png');*/
      }
    }]);

    return Photo;
  })();

  return Photo;
});