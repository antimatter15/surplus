console.log("SURPLUS LOADED");

function mouse(name){
  var evt = document.createEvent("MouseEvents");
  evt.initMouseEvent(name ? ('mouse'+name) : 'click', true, true, window, 0, 0, 0, 1, 1, false, false, false, false, 0, null);
  return evt;
}


var port = chrome.extension.connect({name: "chell"});

function toggle(){
  document.getElementById('gbg1').dispatchEvent(mouse());
}


port.onMessage.addListener(function(msg){
  toggle();
})

var head = document.getElementsByTagName('head')[0],
    style = document.createElement('link');
style.type = 'text/css';
style.rel = 'stylesheet';
style.href = chrome.extension.getURL('surplus.css?'+Math.random())
head.appendChild(style);

setInterval(function(){
  chrome.extension.sendRequest({num: document.getElementById('gbi1').innerHTML});
}, 2000)
