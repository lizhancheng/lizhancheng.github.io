/**
 * CREATED BY ZHANCHENG.LI IN 2016/01/03
 * @class editor
 */
    
 	define(['app', 'zUtil'], (app, ZU) => {

 		'use strict';
 		class EditorTest {

 			constructor(textarea_id, editor_id, auto) {
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

 			init() {
 				let self = this;
 				self.bindEvts();
 			}

 			bindEvts() {
 				// bind basic events
 				let self = this;
 				let tt = self.tt;
 				let et = self.et;
 				let gs = self.gs;
 				let auto = self.auto;

 				if(auto) {
					tt.on('keyup', event => {
						self.setContent(et, event);
					});
					et.on('mouseup', event => {
						self.focusTextarea(tt, event, gs);
						self.syncContent(tt, et);
					});
					et.on('mousedown', event => {
						let val = tt.val().replace(/\<.*\>(.*)\<\/.*\>/igm, '$1');
						tt.val(val);
						self.syncContent(tt, et);
					});
					et.on('keyup', event => {
						event.preventDefault();
						tt.select();
					});
				}
 			}

 			setContent(dest, evt) {
 				let code = evt.keyCode;
 				let src = evt.target;
 				let val = ZU.escapeHtml(src.value);
				let _index = src.selectionStart;
 				dest.html(val);
 			}

 			focusTextarea(dest, event, gs) {
 				if(!dest.val()) {
 					dest[0].focus();
 				}
 				let [p1, p2] = [gs.anchorOffset || gs.baseOffset, gs.extentOffset || gs.focusOffset];
 				let [start, end] = [Math.min(p1, p2), Math.max(p1, p2)];

 				dest[0].select();
 				let [val, tpl] = [dest.val().replace(/\<span class\=\"selected\"\>([.\n]*)/igm, '$1').replace(/\<\/span\>/, ''), '<span class="selected">#</span>'.split('#')];

 				if(start !== end) {
 					let temp = `${tpl[0]}${val.slice(start, end)}${tpl[1]}`;
 					let result = `${val.slice(0, start)}${temp}${val.slice(end)}`;
 					dest.val(result);
 					dest[0].setSelectionRange(start, start + temp.length);
 				}else {
	 				dest[0].setSelectionRange(start, end);
	 				dest.val(val);
 				}
 			}

 			syncContent(tt, et) {
 				let html = tt.val();
 				et.html(html);
 			}

 			utils() {
 				let [save, image, bold, italic] = [
 					angular.element(document.querySelector('.save')), 
 					angular.element(document.querySelector('.image')), 
 					angular.element(document.querySelector('.bold')), 
 					angular.element(document.querySelector('.italic'))
				];
				let self = this;

				save.on('click', event => {
					self.saveContent();
				});

				image.on('click', event => {
					self.insertImage();
				});

				bold.on('click', event => {
					self.setBold();
				});

				italic.on('click', event => {
					self.setItalic();
				});
 			}

 		}

 		class Editor {

 			constructor(et, file, multi) {
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

 			init() {
 				this.utils();
 			}

 			eventBind() {

 			}

 			getPosition() {
 				let gs = this.gs;
 				let [p1, p2] = [gs.anchorOffset || gs.baseOffset, gs.extentOffset || gs.focusOffset];
 				let [start, end] = [Math.min(p1, p2), Math.max(p1, p2)];
 				return {start: start, end: end};
 			}

 			utils() {
 				let [save, image, bold, italic, file, edit] = [
 					angular.element(document.querySelector('.save')), 
 					angular.element(document.querySelector('.image')), 
 					angular.element(document.querySelector('.bold')), 
 					angular.element(document.querySelector('.italic')), 
 					this.file, 
 					this.et
				];
				let self = this;

				save.off('click').on('click', event => {
					self.saveContent();
				});

				image.off('click').on('click', event => {
					file[0].click();
				});

				bold.off('click').on('click', event => {
					self.setBold();
				});

				italic.off('click').on('click', event => {
					self.setItalic();
				});

				file.off('change').on('change', event => {
					self.insertImage(event);
				});

				angular.element(document.querySelectorAll('.content'))
				.off('paste')
				.on('paste', event => {
					self.pasteContent(event);
				});
 			}

 			saveContent() {

 			}

 			insertImage(event) {

 				function recordPosition(self) {
 					let [obj, html, children] = [{}, self.et.html(), self.et.children()];
 					let len = children.length;
 					let [_index, re, i] = [0, /<img/g, 0];

 					while(_index = re.exec(html)) {
 						obj[_index] = children[i ++];
 					}

 					html = html.replace(/<img.*?>/g, '');
 					return obj;
 				}

 				// because a user can normally only select one range at a time, so the rangeCount will usually be 1. Scripting can be used to make the selection contain more than 1 range. And getRangeAt's index can't greater than the rangecount
 				let [children, gr] = [this.et.children(), this.gs.getRangeAt(0)];
 				let target = event.target;
 				let [fr, img] = [new FileReader(), target.files];
 				let self = this;
 				let url = window.URL || window.webkitURL;

 				if(!img.length) {
 					ZU.aLert('请上传相应的图片文件');
 				}else {
 					for(var i = 0;i < img.length;i ++) {
 						var img_node = document.createElement('img');
 						img_node.src = url.createObjectURL(img[i]);
 						img_node.onload = () => {
 							url.revokeObjectURL(img_node.src);
 						}
 						let nodeName = self.gs.focusNode;
	 					if(nodeName.parentNode.nodeName !== "PRE" && nodeName.nodeName !== "PRE") {
		 					if(self.multi) {
		 						document.querySelector(`${self.selector}:not([class~=ng-hide])`).appendChild(img_node);
		 					}else {
			 					self.et.append(img_node);
			 				}
		 				}else {
		 					gr.insertNode(img_node);
	 					}
 					}
 				}

 			}

 			setBold() {  // to make an easier bold setting first

 				this.setFont('b');
 			}

 			setItalic() {
 				this.setFont('i');
 			}

 			setFont(tagName) {

 				let re_text;
 				if(!this.multi) {
	 				let text = this.et.html();
	 				let [re, re_end] = [new RegExp(`<${tagName}>`), new RegExp(`<\/${tagName}>`)];
	 				if(text.match(re)) {
		 				re_text = text.replace(re, '').replace(re_end, '');
	 				}else {
		 				re_text = `<${tagName}>${text}</${tagName}>`;
	 				}

	 				this.et.html(re_text);
 				}else {
 					let selector = document.querySelector(`${this.selector}:not([class~=ng-hide])`);
 					let text = selector.innerHTML;
 					let [re, re_end] = [new RegExp(`<${tagName}>`), new RegExp(`<\/${tagName}>`)];
	 				if(text.match(re)) {
		 				re_text = text.replace(re, '').replace(re_end, '');
	 				}else {
		 				re_text = `<${tagName}>${text}</${tagName}>`;
	 				}

	 				selector.innerHTML = re_text;
 				}
 			}

 			pasteContent(event) {
 				// event.preventDefault();
 				let $target = angular.element(event.target);
 				let [text, gr] = [$target.html(), this.gs.getRangeAt(0)];
				event.clipboardData.items[0].getAsString((param) => {

					$target.html(`${text}${param}`);
				});
 			}

 		}

 		return Editor;
 	});