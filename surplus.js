console.log("SURPLUS LOADED");

function mouse(name){
  var evt = document.createEvent("MouseEvents");
  evt.initMouseEvent(name ? ('mouse'+name) : 'click', true, true, window, 0, 0, 0, 1, 1, false, false, false, false, 0, null);
  return evt;
}

document.getElementById('gbg1').dispatchEvent(mouse())

var head = document.getElementsByTagName('head')[0],
    style = document.createElement('link');
style.type = 'text/css';
style.rel = 'stylesheet';
style.href = chrome.extension.getURL('surplus.css')
head.appendChild(style);

setInterval(function(){
  chrome.extension.sendRequest({num: document.getElementById('gbi1').innerHTML});
}, 5000)
