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
    		if(typeof attachEvent !== "undefined") {
    			obj.attachEvent('on' + eventName, iterator);
    		}else if(typeof addEventListener !== "undefined") {
    			obj.addEventListener(eventName, iterator, capture ? capture : false);
    		}else {
    			obj['on' + eventName] = iterator;
    		}
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

/*Boolean Function*/
	    /**
	     * [isFunction judge function]
	     * @param  {Function} fn variable name
	     * @return {Boolean}     the result of fn
	     */
	    function isFunction(fn) {
		    return (!!fn && !fn.nodename && fn.constructor != String && fn.constructor != RegExp && fn.constructor != Array && /function/i.test(fn+"")) || (Object.prototype.toString.call(fn) === '[object Function]' && typeof fn === 'function');
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
    	 * previewImage a tool to preview the upload or writed-in image
    	 * @param {String} selector buttonId
    	 * @param {String} fileObj buttonId
    	 * @param {Function} handler a function to handle the imgObj and file's path
    	 * @return {Object} Image Object 
    	 */
    	function previewImage(selector, fileObj, handler) {
    		function mockClick(event) {
    			if($fileObj) {
	    			$fileObj.click();
	    		}
	    		event.preventDefault();
    		}
    		function handleFiles(event) {
    			var files = $fileObj.files;
    			var len = files.length;
    			if(!isFunction(handler)) {
    				console.warn('handler no value!');
    				return false;
    			}
    			if(!len) {
    				handler(null);
    			} else {
    				for(var i = 0;i < len;i ++) {
    					var img = document.createElement('img');
    					img.src = window.URL.createObjectURL(files[i]);
    					addEvent(img, 'load', function() {
    						window.URL.revokeObjectURL(this.src);
	    					handler(img, files[i]);
    					});
    				}
    			}
    		}

    		var $selector = typeof selector === 'string' ? document.getElementById(selector) : selector, 
    			$fileObj  = typeof fileObj === 'string' ? document.getElementById(fileObj) : fileObj;

    		window.URL = window.URL || window.webkitURL;
    		addEvent($selector, 'click', mockClick);
    		addEvent($fileObj, 'change', handleFiles);
    	}


    	return {
    		makeTime    : mkduration, 
    		escapeHtml  : escapeHtml, 
    		aLert       : aLert, 
    		previewImage: previewImage, 
    		addEvent    : addEvent
    	};
    });