/**
 * CREATED BY ZHANCHENG.LI IN 2016/01/25
 * @class Photo
 */

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

define('components/photo', ['app', 'zUtil'], function (app, ZU) {

  'use strict';

  var Photo = (function () {
    function Photo(casId, photos) {
      _classCallCheck(this, Photo);

      this.canvas = document.getElementById(casId);
      this.ctx = this.canvas.getContext('2d');
      this.photos = photos;

      this.init();
    }

    _createClass(Photo, [{
      key: 'init',
      value: function init() {
        this.display();
      }
    }, {
      key: 'setViewPort',
      value: function setViewPort(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
      }
    }, {
      key: 'adjustViewPort',
      value: function adjustViewPort() {}
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

        this.ctx.fillStyle = color || '#666666';
        this.ctx.fillRect(5, 5, 25, height * 0.8);

        var icons = [[0, 72], [240, 48], [456, 48], [72, 72]];
        var len = icons.length;
        var img = new Image();
        img.src = path;

        ZU.addEvent(img, 'load', function () {
          for (var i = 0; i < len; i++) {
            // To middle of the tools
            var movedown = height * 0.8 / len * i + height * 0.8 / (len * 2) - toTop + iHeight;
            self.ctx.drawImage(img, icons[i][0], icons[i][1], 14, 14, 12, movedown, 14, 14);
          }
        });
      }
    }, {
      key: 'display',
      value: function display() {
        var self = this;

        self.fillBackground('#555');
        self.addToolBar(false, '../public/images/icons.png');
      }
    }]);

    return Photo;
  })();

  return Photo;
});