/**
 * CREATED BY ZHANCHENG.LI IN 2016/01/04
 * @DESC This is a tool to deal with common operation
 */

    define(function() {

    	'use strict';
/*Event Function*/
    	if(EventSource) {
	    	EventSource.prototype.addListener = typeof attachEvent === "undefined" ? addEventListener : attachEvent;
	    }
    	/**
    	 * [addEvent compatible the eventBinding]
    	 * @param {Object} obj       event-binding's object
    	 * @param {String} eventName the type of event
    	 * @param {Function} iterator  execution when the event happens
    	 * @param {Bool} capture   useCapture
    	 */
    	function addEvent(obj, eventName, iterator, capture) {
    		if( !isFunction( iterator ) ) return false;
    		var eventArr = eventName.split(' ');
    		var len = eventArr.length;
    		obj.eventType = {};
    		for(var i = 0;i < len;i ++) {
	    		obj.eventType[eventArr[i]] = iterator;
	    		if(typeof attachEvent !== "undefined") {
	    			obj.attachEvent('on' + eventArr[i], obj.eventType[eventArr[i]]);
	    		}else if(typeof addEventListener !== "undefined") {
	    			obj.addEventListener(eventArr[i], obj.eventType[eventArr[i]], capture ? capture : false);
	    		}else {
	    			obj['on' + eventArr[i]] = obj.eventType[eventArr[i]];
	    		}
    		}
    	}
    	/**
    	 * [removeEvent delete the event handler]
    	 * @param  {Html Node} obj    document selector
    	 * @param  {String} eventName event name
    	 * @return {Void} 
    	 */
    	function removeEvent(obj, eventName) {
    		if(!eventName) return false;
    		var eventArr = eventName.split(' ');
    		var len = eventArr.length;

    		for(var i = 0;i < len;i ++) {
    			if(typeof detachEvent !== "undefined") {
    				obj.detachEvent('on' + eventArr[i], obj.eventType[eventArr[i]]);
    			}else if(typeof removeEventListener !== "undefined") {
    				obj.removeEventListener(eventArr, obj.eventType[eventArr[i]]);
    			}else {
    				obj['on' + eventArr[i]] = null;
    			}
    			obj.eventType[eventArr[i]] = null;
    		}
    	}
/*Selector Function */
		/**
		 * [getSelector light selector function]
		 * @param  {String|Object} selector if it is a string, uses getting selector function.Otherwise, return the selector
		 * @return {DOMObject} a selector
		 */
		function getSelector(selector) {
			var slice = Array.prototype.slice;
			return typeof selector === 'string' 
					? selector.indexOf('#') > -1  
						? document.getElementById(selector.slice(1))  
						: selector.indexOf('.') > -1  
							? slice.call(document.getElementsByClassName(selector.slice(1))) 
							: slice.call(document.getElementsByTagName(selector))
					: selector;
		}

/*CSS Function*/
		/**
		 * [getStyle get the current style of the selector's property]
		 * @param  {String|Object} selector DOM Node
		 * @param  {String} property CSS property to pass
		 * @return {String} The value of passing property's value
		 */
		function getStyle(selector, property) {
			var $selector = getSelector(selector);
			return getComputedStyle($selector)[property] || $selector.currentStyle[property];
		}

		function setKeyframes($kf, progress, value) {
			$kf.deleteRule(progress);
			$kf.appendRule(value);
		}
/*String Function*/
		/**
		 * toUnicode make all string into unicode or hex style
		 * @param  {String} string   the content to pass in
		 * @param  {Integer} position the position of the string
		 * @return {String}          Unicode or Hex string
		 */
		function toConvert(string, position, type) {
			function get(str) {
				var len = str.length;
				switch(len) {
					case 1: 
						return '000' + str;
					case 2: 
						return '00' + str;
					case 3: 
						return '0' + str;
					default: 
						return str;
				}
			}
			var sign = type === 'hex' ? '0x' : '\\u', hexString = '';
			if(position) {
				hexString = string.charCodeAt(position).toString(16);
				return sign + get(hexString);
			}else {
				var modification = '', length = string.split('').length;
				for(var i = 0;i < length;i ++) {
					hexString = string.charCodeAt(i).toString(16);
					modification += (sign + get(hexString));
				}
				return modification;
			}
		}
		/**
		 * fromConvert make all unicode or hex string into normal string
		 * @param  {String} string the convert string to pass in
		 * @return {String}        output string
		 */
		function fromConvert(string) {
			var array = [], length = array.length;
			if(string.indexOf('0x') > -1) {
				// string = string.replace(/[\\x]/igm, '');
				array = string.split('0x');
			}else if(string.indexOf('\\u') > -1){
				// string = string.replace(/[\\u]/igm, '');
				array = string.split('\\u');
			}else {
				return string;
			}
			length = array.length;
			for(var i = 0;i < length;i ++) {
				array.push(String.fromCharCode(parseInt(array[i], 16)));
			}
			array = array.slice(length);
			return array.join('');
		}
		/**
		 * trim is a function that remove the space from two side
		 * @param  {String} string need to be passed value
		 * @return {String}        the string that be cut without the two side space
		 */
		function trim(string) {
			return string.replace(/^\s*|\s*$/g, '');
		}

/*Boolean Function*/
	    /**
	     * [isFunction judge function]
	     * @param  {Function} fn variable name
	     * @return {Boolean}     the result of fn
	     */
	    function isFunction(fn) {
		    return (!!fn && !fn.nodename && fn.constructor != String && fn.constructor != RegExp && fn.constructor != Array && /function/i.test(fn+"")) || (Object.prototype.toString.call(fn) === '[object Function]' && typeof fn === 'function');
		}
		/**
		 * [isArray judge array]
		 * @param  {All}  val the pass value
		 * @return {Boolean} whether it is an array
		 */
		function isArray(val) {
			return toString.apply(val) === '[object Array]' && val instanceof Array;
		}
/*Time Function*/
    	// format number
    	function format(t) {
    		t = t >= 10 ? t : ('0' + t);
    		return t;
    	}
    	// return the song time format
    	function mkduration(timestamps, supply) {
    		if(!timestamps) return;
    		timestamps = Math.floor(timestamps);
    		var h, i, s, t;
    		h = i = s = 0;
    		while(timestamps > 0) {
    			if(timestamps > 60) {
    				++ i >= 60 ? (++ h, i = 0) : i = i;
    				timestamps -= 60;
    			}else {
    				s = timestamps;
    				break;
    			}
    		}
    		i = format(i);
    		s = format(s);
    		t = i + ':' + s;
    		if(supply) {
	    		return h > 0 ? '00:00:00/' + format(h) + ':' + t : '00:00/' + t; 
	    	}else {
	    		return h > 0 ? format(h) + ':' + t : t;
	    	}
    	}
/*HTML Dealing Function*/
    	/**
    	 * HTML escape
    	 *
    	 * @param {String} html
    	 */
    	function escapeHtml(html) {
    		return html.replace(/</igm, '&lt;').replace(/>/igm, '&gt;');
    	}
    	/**
    	 * aLert tips
    	 * @param  {String} string tips' content
    	 * @return {Void}
    	 */
    	function aLert(string) {
    		alert(string);
    	}
/*Image Function*/
		/**
		 * [showProgress the images loading progress]
		 * @param  {ImgObject} imgs  It must be an object of image type
		 * @param  {Function} iterator to handle each function of the images object
		 * @return {Void}
		 */
		function showProgress(imgs, iterator) {
			function handle(img, total, index) {
				var percent;
				if(img.onreadystatechange) {
					addEvent(img, 'readystatechange', function () {
						if(img.readyState === 'complete' || img.readyState === 'loaded') {
							percent = (++ num) * 100 / total;
							iterator(percent);
						}
					});
				}else {
					addEvent(img, 'load', function () {
						if(img.complete === true) {
							percent = (++ num) * 100 / total;
							iterator(percent);
						}
					});
				}
				if(!Number.isNaN(index) && imgs[++ index]) {
					handle(imgs[index], total, index);
				}
			}

			if(!isFunction(iterator)) return;
			var num = 0;
			if(imgs && imgs.length && imgs.length > 0) {
				var len = imgs.length;
				handle(imgs[0], len, 0);
			}else if(imgs) {
				handle(img, 1);
			}

		}

/*File Function*/
    	/**
    	 * loadFile a tool to load the local file, eg: image, pdf, etc
    	 * @param {String} selector buttonId
    	 * @param {String} fileObj buttonId
    	 * @param {Function} handler a function to handle the fileObj or fileString
    	 * @param {String or Boolean} to define it pdf or false
    	 * @return {Object} File Object 
    	 */
    	function loadFile(selector, fileObj, handler, type) {
    		/**
    		 * mockClick use an element to simulate the click event on file element
    		 * @param  {Event} event the event object
    		 * @return {Void}   
    		 */
    		function mockClick(event) {
    			if($fileObj) {
	    			$fileObj.click();
	    		}
	    		// event.preventDefault();
    		}
    		function handleImage(file) {
				var img = document.createElement('img');
				img.src = window.URL.createObjectURL(file);
				addEvent(img, 'load', function() {
					window.URL.revokeObjectURL(this.src);
					handler(img, file);
				});    			
    		}
    		function handlePdf(file) {
    			var embed = window.URL.createObjectURL(file);
    			var html = '<embed width="800px" height="600px" name="plugin" id="plugin" src="' + embed +'" type="application/pdf">';
    			handler(html, file);
    		}
    		function handleFiles(event) {
    			event.preventDefault();
    			var files = event.dataTransfer ? event.dataTransfer.files : $fileObj.files;
    			var len = files.length;
    			var callBack = type === 'pdf' ? handlePdf : handleImage;
    			if(!isFunction(handler)) {
    				console.warn('handler no value!');
    				return false;
    			}
    			if(!len) {
    				handler(null);
    			} else {
    				for(var i = 0;i < len;i ++) {
    					if(type !== false) {
	    					callBack(files[i]);
	    				} else {
	    					handler(files[i]);
	    				}
    				}
    			}
    		}

    		var $selector = typeof selector === 'string' ? document.getElementById(selector) : selector, 
    			$fileObj  = typeof fileObj === 'string' ? document.getElementById(fileObj) : fileObj;

    		window.URL = window.URL || window.webkitURL;
    		addEvent($selector, 'click', mockClick);
    		addEvent($selector, 'drop', handleFiles);
    		addEvent($selector, 'dragover', function (event) {event.preventDefault();});

    		addEvent($fileObj, 'change', handleFiles);
    	}

    	return {
    		makeTime    : mkduration, 
    		escapeHtml  : escapeHtml, 
    		aLert       : aLert, 
    		loadFile    : loadFile, 
    		addEvent    : addEvent, 
    		getSelector : getSelector, 
    		getStyle    : getStyle, 
    		setKeyframes: setKeyframes, 
    		showProgress: showProgress
    	};
    });