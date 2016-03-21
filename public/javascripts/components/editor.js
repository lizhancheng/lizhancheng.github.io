/**
 * CREATED BY ZHANCHENG.LI IN 2016/01/03
 * @class editor
 */

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

define(['app', 'zUtil'], function (app, ZU) {

  'use strict';

  var EditorTest = (function () {
    function EditorTest(textarea_id, editor_id, auto) {
      _classCallCheck(this, EditorTest);

      // textarea jqLite-object
      this.tt = angular.element(document.querySelector(textarea_id));
      // div jqLite-object
      this.et = angular.element(document.querySelector(editor_id));
      // whether bind events automatically
      this.auto = auto;
      // getSelection method
      this.gs = getSelection();
      // initial
      this.init();
    }

    _createClass(EditorTest, [{
      key: 'init',
      value: function init() {
        var self = this;
        self.bindEvts();
      }
    }, {
      key: 'bindEvts',
      value: function bindEvts() {
        // bind basic events
        var self = this;
        var tt = self.tt;
        var et = self.et;
        var gs = self.gs;
        var auto = self.auto;

        if (auto) {
          tt.on('keyup', function (event) {
            self.setContent(et, event);
          });
          et.on('mouseup', function (event) {
            self.focusTextarea(tt, event, gs);
            self.syncContent(tt, et);
          });
          et.on('mousedown', function (event) {
            var val = tt.val().replace(/\<.*\>(.*)\<\/.*\>/igm, '$1');
            tt.val(val);
            self.syncContent(tt, et);
          });
          et.on('keyup', function (event) {
            event.preventDefault();
            tt.select();
          });
        }
      }
    }, {
      key: 'setContent',
      value: function setContent(dest, evt) {
        var code = evt.keyCode;
        var src = evt.target;
        var val = ZU.escapeHtml(src.value);
        var _index = src.selectionStart;
        dest.html(val);
      }
    }, {
      key: 'focusTextarea',
      value: function focusTextarea(dest, event, gs) {
        if (!dest.val()) {
          dest[0].focus();
        }
        var p1 = gs.anchorOffset || gs.baseOffset;
        var p2 = gs.extentOffset || gs.focusOffset;
        var start = Math.min(p1, p2);
        var end = Math.max(p1, p2);

        dest[0].select();
        var val = dest.val().replace(/\<span class\=\"selected\"\>([.\n]*)/igm, '$1').replace(/\<\/span\>/, '');
        var tpl = '<span class="selected">#</span>'.split('#');

        if (start !== end) {
          var temp = '' + tpl[0] + val.slice(start, end) + tpl[1];
          var result = '' + val.slice(0, start) + temp + val.slice(end);
          dest.val(result);
          dest[0].setSelectionRange(start, start + temp.length);
        } else {
          dest[0].setSelectionRange(start, end);
          dest.val(val);
        }
      }
    }, {
      key: 'syncContent',
      value: function syncContent(tt, et) {
        var html = tt.val();
        et.html(html);
      }
    }, {
      key: 'utils',
      value: function utils() {
        var save = angular.element(document.querySelector('.save'));
        var image = angular.element(document.querySelector('.image'));
        var bold = angular.element(document.querySelector('.bold'));
        var italic = angular.element(document.querySelector('.italic'));

        var self = this;

        save.on('click', function (event) {
          self.saveContent();
        });

        image.on('click', function (event) {
          self.insertImage();
        });

        bold.on('click', function (event) {
          self.setBold();
        });

        italic.on('click', function (event) {
          self.setItalic();
        });
      }
    }]);

    return EditorTest;
  })();

  var Editor = (function () {
    function Editor(et, file, multi) {
      _classCallCheck(this, Editor);

      // pre jqLite-object
      this.et = angular.element(document.querySelector(et));
      // file jqLite-object
      this.file = angular.element(document.querySelector(file));
      // multiply the editable area
      this.multi = multi;
      // pre children
      this.children = null;
      // getSelection method
      this.gs = getSelection();
      // editor initiate
      this.selector = et;
      this.init();
    }

    _createClass(Editor, [{
      key: 'init',
      value: function init() {
        this.utils();
      }
    }, {
      key: 'eventBind',
      value: function eventBind() {}
    }, {
      key: 'getPosition',
      value: function getPosition() {
        var gs = this.gs;
        var p1 = gs.anchorOffset || gs.baseOffset;
        var p2 = gs.extentOffset || gs.focusOffset;
        var start = Math.min(p1, p2);
        var end = Math.max(p1, p2);

        return { start: start, end: end };
      }
    }, {
      key: 'utils',
      value: function utils() {
        var save = angular.element(document.querySelector('.save'));
        var image = angular.element(document.querySelector('.image'));
        var bold = angular.element(document.querySelector('.bold'));
        var italic = angular.element(document.querySelector('.italic'));
        var file = this.file;
        var edit = this.et;

        var self = this;

        save.off('click').on('click', function (event) {
          self.saveContent();
        });

        image.off('click').on('click', function (event) {
          file[0].click();
        });

        bold.off('click').on('click', function (event) {
          self.setBold();
        });

        italic.off('click').on('click', function (event) {
          self.setItalic();
        });

        file.off('change').on('change', function (event) {
          self.insertImage(event);
        });

        angular.element(document.querySelectorAll('.content')).off('paste').on('paste', function (event) {
          self.pasteContent(event);
        });
      }
    }, {
      key: 'saveContent',
      value: function saveContent() {}
    }, {
      key: 'insertImage',
      value: function insertImage(event) {

        function recordPosition(self) {
          var obj = {};
          var html = self.et.html();
          var children = self.et.children();

          var len = children.length;
          var _index = 0;
          var re = /<img/g;
          var i = 0;

          while (_index = re.exec(html)) {
            obj[_index] = children[i++];
          }

          html = html.replace(/<img.*?>/g, '');
          return obj;
        }

        // because a user can normally only select one range at a time, so the rangeCount will usually be 1. Scripting can be used to make the selection contain more than 1 range. And getRangeAt's index can't greater than the rangecount
        var children = this.et.children();
        var gr = this.gs.getRangeAt(0);

        var target = event.target;
        var fr = new FileReader();
        var img = target.files;

        var self = this;
        var url = window.URL || window.webkitURL;

        if (!img.length) {
          ZU.aLert('请上传相应的图片文件');
        } else {
          for (var i = 0; i < img.length; i++) {
            var img_node = document.createElement('img');
            img_node.src = url.createObjectURL(img[i]);
            img_node.onload = function () {
              url.revokeObjectURL(img_node.src);
            };
            var nodeName = self.gs.focusNode;
            if (nodeName.parentNode.nodeName !== "PRE" && nodeName.nodeName !== "PRE") {
              if (self.multi) {
                document.querySelector(self.selector + ':not([class~=ng-hide])').appendChild(img_node);
              } else {
                self.et.append(img_node);
              }
            } else {
              gr.insertNode(img_node);
            }
          }
        }
      }
    }, {
      key: 'setBold',
      value: function setBold() {
        // to make an easier bold setting first

        this.setFont('b');
      }
    }, {
      key: 'setItalic',
      value: function setItalic() {
        this.setFont('i');
      }
    }, {
      key: 'setFont',
      value: function setFont(tagName) {

        var re_text = undefined;
        if (!this.multi) {
          var text = this.et.html();
          var re = new RegExp('<' + tagName + '>');
          var re_end = new RegExp('</' + tagName + '>');

          if (text.match(re)) {
            re_text = text.replace(re, '').replace(re_end, '');
          } else {
            re_text = '<' + tagName + '>' + text + '</' + tagName + '>';
          }

          this.et.html(re_text);
        } else {
          var selector = document.querySelector(this.selector + ':not([class~=ng-hide])');
          var text = selector.innerHTML;
          var re = new RegExp('<' + tagName + '>');
          var re_end = new RegExp('</' + tagName + '>');

          if (text.match(re)) {
            re_text = text.replace(re, '').replace(re_end, '');
          } else {
            re_text = '<' + tagName + '>' + text + '</' + tagName + '>';
          }

          selector.innerHTML = re_text;
        }
      }
    }, {
      key: 'pasteContent',
      value: function pasteContent(event) {
        // event.preventDefault();
        var $target = angular.element(event.target);
        var text = $target.html();
        var gr = this.gs.getRangeAt(0);

        event.clipboardData.items[0].getAsString(function (param) {

          $target.html('' + text + param);
        });
      }
    }]);

    return Editor;
  })();

  return Editor;
});