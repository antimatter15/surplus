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

function is_activated(index){
  var els = [].slice.call(
    document.querySelectorAll(".gbtc")[1]
    .querySelectorAll(".gbt")
  ,0)
    .filter(function(e){
      return e.firstChild.className != 'gbts' //parseInt(getComputedStyle(e).width) > 1
  });
  return els[index].className.split(' ').indexOf("gbto") != -1;
}

function ensure_share(state){
  var gbwc = document.querySelector('#gbwc');
  var isopen = is_activated(2); //gbwc ? (!!(gbwc.style.display != 'none' && gbwc.style.height && is_activated(2))) : false;
  log("Checking share visibility state", is_activated(2), isopen, state);
  if(isopen != state) toggleShare();
}

function ensure(state){
  var gbwc = document.querySelector('#gbwc');
  var isopen = is_activated(1); //gbwc ? (!!(gbwc.style.display != 'none' && gbwc.style.height && is_activated(1))) : false;
  log("Checking visible state", is_activated(1), isopen, state);
  if(isopen != state) toggle();
}

var port = chrome.extension.connect({name: "chell"});
var sharing = false;
var error = false;

port.onMessage.addListener(function(msg){
  if(error) return;
  
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

function update_status(){
  var el = document.getElementById('gbi1')
  if(document.getElementById('gbi4t')){
    var uid = document.getElementById('gbi4t').innerText
  }else if(document.querySelector('a[href="//google.com/profiles"]')){    
    var uid = document.querySelector('a[href="//google.com/profiles"]').innerText.trim();
  }else{
    var uid = 'None';
  }
  
  var frame = document.querySelector('#gbwc iframe');
  
  if(!el){
    error = true;
    if(uid) port.postMessage({error: 'User does not have Google+.', user: uid, code: 6});
    else port.postMessage({error: 'Please sign into Google+', user: ''});
  }else{
    port.postMessage({num: el.innerText, user: uid, src: frame?frame.src:'', height: frame?parseInt(document.querySelector('#gbwc').style.height):null})
  }

  scrollTo(0,0)
  
  
}
setInterval(update_status, 1000);

setTimeout(function(){
  setInterval(function(){
    if(!is_activated(1) && !is_activated(2)){
      ensure_share(true);
    }
  }, 762);
}, 1618);
update_status();

var head = document.getElementsByTagName('head')[0], style = document.createElement('link');
style.type = 'text/css';
style.rel = 'stylesheet';
style.href = chrome.extension.getURL('surplus.css?'+Math.random())
head.appendChild(style);


