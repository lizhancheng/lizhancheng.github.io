/**
 * CREATED BY ZHANCHENG.LI IN 2016/01/04
 * @DESC This is a tool to deal with common operation
 */

    define(function() {

    	'use strict';
    	function format(t) {
    		t = t >= 10 ? t : ('0' + t);
    		return t;
    	}
    	function mkduration(timestamps) {
    		if(!timestamps) return;
    		timestamps = Math.floor(timestamps);
    		var h, i, s;
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
    		return h > 0 ? '00:00:00/' + format(h) + ':' + i + ':' + s : '00:00/' + i + ':' + s; 
    	}

    	return {
    		makeTime: mkduration
    	};
    });