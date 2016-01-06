/**
 * CREATED BY ZHANCHENG.LI IN 2016/01/04
 * @DESC This is a tool to deal with common operation
 */

    define(function() {

    	'use strict';
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

    	return {
    		makeTime: mkduration
    	};
    });