var furl = '';
if(localStorage.althost == 'yes'){
  furl = "http://www.google.com/blogsearch?extension=surplus&authuser="+(localStorage.auth_user||0);
}else{
  furl = "http://images.google.com/?extension=surplus&authuser="+(localStorage.auth_user||0);
}

var unlucky = /unlucky/.test(location.search);
var ultra_low_memory = (localStorage.mode == 'lite') || unlucky || false;
var low_memory = ultra_low_memory || (localStorage.mode == 'lmm');
if(!low_memory){
  document.write("<iframe id='frame' src='"+furl+"'><"+"/iframe"+">");
}

var frame = document.getElementById('frame');
if(frame){
  frame.onload = function(){
    frame.onload = null;
    setTimeout(function(){
      
      if(!global_port){
        console.log("FAILURE");
        return;
        if(navigator.userAgent.indexOf('Chrome/13.') != -1 && navigator.userAgent.indexOf('Windows') != -1){
          location.href += "?unlucky";
        }else if(!/retry/.test(location.search)){
          setTimeout(function(){
            location.href += "?retry";
          }, 1000);
        }else{
          setTimeout(function(){
            location.href += "?unlucky";
          }, 1000);
        }
      }
    }, 1000);
  }
}

//rise of the planet of the globals
var heightstate = 0;
var login_error = false;
var visible = false;
var share_visible = false;
var current_user = '';
var global_port;
var global_port_src = '';
var global_inner_port;
var baseheight = 525;
var connect_times = 0;
var last_recorded_number = -1;
var last_recorded_time = +new Date;
var last_updated_time = 0;
var update_queued = false;
var editing = false;
var old_num = 0;


function shift_frame(){
  frame.style.height = (baseheight + ((heightstate += 0.01)))+'px'; //hopefully users dont notice 7px diffs
}


function popup_loaded(){
  chrome.browserAction.setPopup({popup:''});
}

function popup_closed(){
  heightstate = 0;
  setTimeout(function(){
    if(ultra_low_memory){
      chrome.browserAction.setPopup({popup:'lite.html'})
    }else{
      chrome.browserAction.setPopup({popup:'popup.html'})
    }
  },/Windows/.test(navigator.userAgent)?762:267) //762 is the feynman point in pi
  //i just woke up one day with the number stuck in my head
}

function start_load(){
  //yay its been loaded!
  if(!global_port && !low_memory){
    console.log("loaded popup and notification port not found yet")
    setTimeout(function(){
      start_load();
    }, 314) //this is pi
  }else if(!(visible == true && editing == true)){
    if(localStorage.smartshare != 'no'){
      if(old_num == 0){
        open_share();
      }else{
        ensure_open();
      }
    }else{
      ensure_open();
    }
  }
}
function evacuate(){
  console.log("Evacuate");
  if(low_memory){
    frame.src = 'about:blank';
    frame.parentNode.removeChild(frame);
    delete frame;
    frame = null;
  }else{
    console.log('restoring window')
    document.adoptNode(frame);
    document.body.appendChild(frame);
    global_inner_port.postMessage({action: 'checkediting'})
  }
}




function open_share(){
  console.log("Opening Share Window");
  shift_frame()
  share_visible = true;
  visible = false;
  if(localStorage.nocurrentpage == 'yes'){
    global_inner_port.postMessage({action: 'sharevisible', value: share_visible})
    global_port.postMessage({action: 'share', visible: share_visible});
  }else if(global_inner_port){
    chrome.tabs.getSelected(null, function(tab){
      console.log("Got current tab", tab)      
      global_inner_port.postMessage({action: 'sharevisible', value: share_visible, current_url: tab.url})
      global_port.postMessage({action: 'share', visible: share_visible});
    })
  }
  
}

function ensure_open(){
  console.log("opening popup");
  global_port.postMessage({action: 'winstate', state: true});
  shift_frame();
  share_visible = false;
  visible = true;
  setTimeout(manualUpdate, 1000);
  
  if(global_inner_port){//this really doesn't do anything btw
    global_inner_port.postMessage({action: 'sharevisible', value: share_visible, user: current_user})
  }  
}

function ensure_closed(){
  open_share();
}

function manualUpdate(){
  if(new Date - last_updated_time > 3000){
    forceUpdate();
    last_updated_time  = +new Date;
    update_queued = false;
  }else if(update_queued == false){
    update_queued = true;
    setTimeout(manualUpdate, 4000);
  }
}

function forceUpdate(){
  var counturl = 'https://plus.google.com/u/'+(localStorage.auth_user||0)+'/_/n/guc';
  if(global_inner_port){
    global_inner_port.postMessage({action:'xhr', url: counturl});
  }else{
    var xhr = new XMLHttpRequest();
    xhr.open('get',counturl,true);
    xhr.onload = function(){
      handleCount(xhr.responseText);
    }
    xhr.send();
  }
}

function handleCount(text){
  var num = JSON.parse(text.substr(4))[1];
  drawIcon(num);
  if(old_num < num) getNotifications(num);
  if((num-old_num) != 0){
    console.log('Got Notifications',num, 'Delta='+(num-old_num));   
  }
  old_num = num;
}

 /*
  * Hi. I did this with VectorEdtor and scratchpad, so I guess I'll try to do the same here with Surplus
  * If you are reading this code, in the distant future, say, the year 2012 and you are, as any sensible 
  * human (presuming that you are a human) would, preparing for the Mayan and Timewave Zero-predicted 
  * impending apocalypse, (or not) it doesn't matter. You should totally email me at antimatter15@gmail.com 
  * because it's always an interesting feeling to realize that the future.
  * 
  * If the world has already ended, there's a good chance that I won't be able to respond, and it's hard to
  * foresee anyone reading this in a post-apocalyptic world. Nonetheless, if you do manage to read this 
  * after life on earth has ceased, please document your tale.
  */

function drawIcon(num){
  num += '';
  if(localStorage.usebadge == 'yes') { 
    chrome.browserAction.setBadgeText({ text:num=='0'?'':num });
    chrome.browserAction.setIcon({path: 'img/classic.png'});
  }else{
    chrome.browserAction.setBadgeText({ text:'' });
    var c = document.createElement('canvas').getContext('2d');
    var none = (num.replace(/[\s0]/g,'') == '');
    var img = new Image();
    img.src = none ? 'img/old.png' : 'img/new.png';
    img.onload = function(){
      c.drawImage(img, 0, 0);
      c.font = "bold 13px arial,sans-serif";
      c.fillStyle = none ? '#CCC' : '#fff';
      if(parseInt(num) > 9 || num == '9+'){
        c.fillText('9+', 3, 14);
      }else{
        c.fillText(num+'', 6, 14);
      }
      chrome.browserAction.setIcon({imageData: c.getImageData(0,0,19,19)})
    }
  }
}


function check_althost(){
  if(localStorage.althost == 'yes') return;
  var xhr = new XMLHttpRequest();
  xhr.open('get', "http://images.google.com/?extension=surplus&authuser="+(localStorage.auth_user||0), true);
  xhr.onload = function(){
    var iHasNotify = xhr.responseText.indexOf('_/notifications/frame') != -1;
    xhr.open('get', "http://blogsearch.google.com/?extension=surplus&authuser="+(localStorage.auth_user||0), true);
    xhr.onload = function(){
      var vHasNotify = xhr.responseText.indexOf('_/notifications/frame') != -1;
      if(iHasNotify == false && vHasNotify == true){
        localStorage.althost = 'yes';
        location.reload();
      }
    }
    xhr.send()
  }
  xhr.send();
}

chrome.extension.onConnect.addListener(function(port) {
  if(port.name == 'chell'){ // i dont know why i'm naming this after portal 2  characters

    chrome.browserAction.setPopup({popup:'popup.html'});
    console.log("Initialized new Sandbar Port", port);
    global_port = port;
    global_port_src = '';
    global_inner_port = null;
    if(!visible){
      console.log('------------------OPEN SHAREW')
      open_share();
    }else{
      console.log('------------------OPEN NOTIFIAKETSN')
      ensure_open();
    }
    port.onDisconnect.addListener(function(msg){
      console.log('|||||||||||||||||||DISCONNECTED SANDBAR PORT|||||||||||||||||||');
    })
    port.onMessage.addListener(function(msg){
      current_user = msg.user;
      global_port_src = msg.src;
      if(msg.error){
        login_error = msg.error;
        drawIcon("!!");
        if(msg.code == 6) check_althost();
        
      }else if(msg.log){
        console.log('r', msg.log);
      }else{
        if(share_visible && msg.height)
          frame.style.height = Math.max(msg.height+300, baseheight)+'px';
        
        if(last_recorded_number != msg.num && (+new Date - last_recorded_time) > 2000){
          setTimeout(manualUpdate, 100);
          last_recorded_time = +new Date;
          last_recorded_number = msg.num;
        }
      }
    })
  }else{ // if(port.name == 'wheatley'){
    function poll(){
      if(global_port_src){
        if(global_port_src == port.name){
          console.log("Initialized new Notifications Port", port);
          global_inner_port = port;
          port.postMessage({action: 'accept', user: current_user});
          port.onDisconnect.addListener(function(msg){
            console.log('|||||||||||||||||||DISCONNECTED INNER PORT|||||||||||||||||||');
          })
          port.onMessage.addListener(function(msg){
            if(msg.action == 'xhr'){
              handleCount(msg.response)
            }else if(msg.action == 'share'){
              open_share();
            }else if(msg.action == 'profile'){
              chrome.tabs.create({url: 'https://plus.google.com/u/'+(localStorage.auth_user||0)+'/'})
            }else if(msg.action == 'reload'){
              frame.src = frame.src;
              frame.style.visibility = 'hidden';
              setTimeout(function(){
                frame.style.visibility = '';
              }, 762);
            }else if(msg.action == 'shownotifications'){
              ensure_open();
            }else if(msg.action == 'checkediting'){
              if(!msg.value) ensure_closed();
              editing = msg.value;
            }
          })
        }
      }else setTimeout(poll, 97);
    }
    poll();
  }
});

function updatelastreadtime(callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('get', 'https://plus.google.com/u/' + (localStorage.auth_user || 0) + '/notifications/all', true);
  xhr.onload = function() {
    var code = xhr.responseText.match(/"https:\/\/www\.google\.com\/csi"\,"([A-Za-z0-9\-_:]+)"\,\,\,/)[1];
    var xhr2 = new XMLHttpRequest();
    xhr2.onload = function() {
      if (callback) callback();
    }
    xhr2.open('post', 'https://plus.google.com/u/' + (localStorage.auth_user || 0) + '/_/notifications/updatelastreadtime', true);
    xhr2.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
    xhr2.send('time=' + (1000 * new Date) + '&at=' + code);
  }
  xhr.send();
}
function getNotifications(num){
  if(visible) return;
  num += '';
  chrome.idle.queryState(parseInt(localStorage.idle_duration||"15") * 60, function(state){
  if(state == 'idle') return;
  if(num.replace(/[\s0]/g,'') != ''){
    if(localStorage.notify == 'yes'){

      var xhr = new XMLHttpRequest();
      xhr.open('get', 'https://plus.google.com/u/'+(localStorage.auth_user || 0)+'/_/notifications/getnotificationsdata', true);
      xhr.onload = function(){
        var notifications = parseNotifications(eval(xhr.responseText.substr(5)));
        showqueue = showqueue.concat(notifications.slice(0, parseInt(num)));
        if(localStorage.notifyread == 'yes'){
          updatelastreadtime()
        }
      }
      xhr.send();
      
    }else if(localStorage.notify_sound == 'yes'){
      (new Audio("notify.ogg")).play();
    }
  }
})
}
var showqueue = [];
var notify_message = '', notify_image = '';
function showMessage() {
  var msg = showqueue.shift();
  if (msg) {
    if (msg[0] == notify_message) return showMessage(); //dont repeat messages
    if (localStorage.notify_sound == 'yes')(new Audio("notify.ogg")).play();

    window.notify_message = msg.html;
    window.notify_image = msg.pic;
    var notification = window.webkitNotifications.createHTMLNotification('notification.html');;

    notification.show();
    setTimeout(function() {
      notification.cancel();
    }, parseInt(localStorage.autodismiss || 5) * 1000);
  }
}


function chromeOS() {
  chrome.windows.create({
    url: "popup.html",
    width: 440,
    height: baseheight,
    type: 'popup'
  })
}


setInterval(showMessage, 6000); //seems like a good duration


var birthday = +new Date;

setInterval(function(){manualUpdate()}, 20 * 1000);

setInterval(function(){
  if(!low_memory){
    if(new Date - birthday > 1000 * 60 * 20){
      chrome.idle.queryState(15 * 60, function(state){
        if(state == 'idle'){
          location.reload();
        }
      })
    }
  }
}, 5000);


drawIcon('');


if(!low_memory){
  chrome.browserAction.setPopup({popup:''});
}else{
  manualUpdate();
  if(ultra_low_memory){
    chrome.browserAction.setPopup({popup:'lite.html'});
  }else{
    chrome.browserAction.setPopup({popup:'popup.html'});
  }
}

