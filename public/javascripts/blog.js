/*
 * Created By zhancheng.li in 2015/11/09
 */

'use strict';

function removeLoad() {

  document.querySelector('.loading').remove();
}

setTimeout(function () {
  removeLoad();
}, 2000);