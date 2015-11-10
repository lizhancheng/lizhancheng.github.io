/*
 * Created By zhancheng.li in 2015/11/09
 */

'use strict';

function removeLoad() {

  document.getElementById('loading').style.display = "none";
}

setTimeout(function () {
  removeLoad();
}, 2000);