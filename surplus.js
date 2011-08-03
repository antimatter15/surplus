console.log("SURPLUS LOADED");

function mouse(name){
  var evt = document.createEvent("MouseEvents");
  evt.initMouseEvent(name ? ('mouse'+name) : 'click', true, true, window, 0, 0, 0, 1, 1, false, false, false, false, 0, null);
  return evt;
}

function toggle(){
  document.getElementById('gbg1').dispatchEvent(mouse());
}

function toggleShare(){
  document.getElementById('gbg3').dispatchEvent(mouse());
}

var port = chrome.extension.connect({name: "chell"});
var sharing = false;
port.onMessage.addListener(function(msg){
  if(msg.action == "notification"){
    toggle();
  }else if(msg.action == 'share'){
    toggleShare()
    sharing = msg.visible;
  }
})

port.onDisconnect.addListener(function(){
  location.reload();
})

setInterval(function(){
  var el = document.getElementById('gbi1')
  var uid = document.getElementById('gbi4').innerText || document.querySelector('a[href="//google.com/profiles"]').innerText.trim();
  
  var frame = document.querySelector('#gbwc iframe');
  
  if(!el){
    if(uid) port.postMessage({error: 'User does not have Google+.', user: uid});
    else port.postMessage({error: 'Please sign into Google first'});
  }else{
    port.postMessage({num: el.innerText, user: uid, src: frame?frame.src:'', height: frame?parseInt(document.querySelector('#gbwc').style.height):null})
  }

  scrollTo(0,0)

}, 1000)

var head = document.getElementsByTagName('head')[0], style = document.createElement('link');
style.type = 'text/css';
style.rel = 'stylesheet';
style.href = chrome.extension.getURL('surplus.css?'+Math.random())
head.appendChild(style);


