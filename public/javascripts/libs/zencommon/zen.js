/**
 * CREATED BY ZHANCHENG.LI IN 2016/01/04
 * @DESC This is a tool to deal with common operation
 */

    define(function() {

    	'use strict';

    	if(EventSource) {
	    	EventSource.prototype.addListener = typeof attachEvent === "undefined" ? addEventListener : attachEvent;
	    }
	    /**
	     * [isFunction judge function]
	     * @param  {Function} fn variable name
	     * @return {Boolean}     the result of fn
	     */
	    function isFunction(fn) {
		    return (!!fn && !fn.nodename && fn.constructor != String && fn.constructor != RegExp && fn.constructor != Array && /function/i.test(fn+"")) || (Object.prototype.toString.call(fn) === '[object Function]' && typeof fn === 'function');
		}
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
    	/**
    	 * previewImage a tool to preview the upload or writed-in image
    	 * @param {String} selector buttonId
    	 * @param {String} fileObj buttonId
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
    					});
    					handler(img, files[i]);
    				}
    			}
    		}

    		var $selector = document.getElementById(selector), 
    			$fileObj  = document.getElementById(fileObj);

    		window.URL = window.URL || window.webkitURL;
    		addEvent($selector, 'click', mockClick);
    		addEvent($fileObj, 'change', handleFiles);
    	}




    	return {
    		makeTime    : mkduration, 
    		escapeHtml  : escapeHtml, 
    		aLert       : aLert, 
    		previewImage: previewImage
    	};
    });