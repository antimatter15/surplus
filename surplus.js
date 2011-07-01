console.log("SURPLUS LOADED");

function mouse(name){
  var evt = document.createEvent("MouseEvents");
  evt.initMouseEvent(name ? ('mouse'+name) : 'click', true, true, window, 0, 0, 0, 1, 1, false, false, false, false, 0, null);
  return evt;
}
function toggle(){
  document.getElementById('gbg1').dispatchEvent(mouse());
}


var port = chrome.extension.connect({name: "chell"});

port.onMessage.addListener(function(msg){
  toggle();
})

var div = document.createElement('div');
div.className = 'surplus_mesage';
div.style.display = 'none';
document.body.appendChild(div);

setInterval(function(){
  var el = document.getElementById('gbi1')
  if(!el){
    var uid = document.getElementById('gbi4');
    if(uid) port.postMessage({error: 'User '+uid.innerText+' does not have Google+'});
    else port.postMessage({error: 'Please sign into Google first'});
  }else{
    port.postMessage({num: el.innerText})
  }
}, 1000)

var head = document.getElementsByTagName('head')[0], style = document.createElement('link');
style.type = 'text/css';
style.rel = 'stylesheet';
style.href = chrome.extension.getURL('surplus.css?'+Math.random())
head.appendChild(style);


