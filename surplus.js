log("SURPLUS LOADED");

function mouse(name){
  var evt = document.createEvent("MouseEvents");
  evt.initMouseEvent(name ? ('mouse'+name) : 'click', true, true, window, 0, 0, 0, 1, 1, false, false, false, false, 0, null);
  return evt;
}

function toggle(){
  log("Toggling Notifications Button");
  document.getElementById('gbg1').dispatchEvent(mouse());
}

function toggleShare(){
  log("Toggling Share Button");
  document.getElementById('gbg3').dispatchEvent(mouse());

}



function ensure_share(state){
  var gbwc = document.querySelector('#gbwc');
  var isopen = gbwc ? (gbwc.style.display != 'none') : false;
  if(isopen != state) toggleShare();
}

function ensure(state){
  var gbwc = document.querySelector('#gbwc');
  var isopen = gbwc ? (!!(gbwc.style.display != 'none' && gbwc.style.height)) : false;
  log("Checking visible state", gbwc, isopen, state);
  if(isopen != state) toggle();
}

var port = chrome.extension.connect({name: "chell"});
var sharing = false;
port.onMessage.addListener(function(msg){
  if(msg.action == "winstate"){
    ensure(msg.state);
  }else if(msg.action == 'share'){
    ensure_share(msg.visible);
    sharing = msg.visible;
  }
})

function log(){
  var text = [].slice.call(arguments, 0).join(' ');
  (function(){
    if(port){
      port.postMessage({log: text})
    }else setTimeout(arguments.callee, 500)
  })();
  arguments.length
  var args = 'abcdefghijklmnopqrstuvwxyz'.split('').slice(0, arguments.length);
  (new Function(args.join(','),'console.log('+args.join(',')+')')).apply(this, arguments);
}

port.onDisconnect.addListener(function(){
  setTimeout(function(){
    location.reload();
  }, 762);
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


