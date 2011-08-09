var furl = '';
if(localStorage.althost == 'yes'){
  furl = "http://video.google.com/?extension=surplus&authuser="+(localStorage.auth_user||0);
}else{
  furl = "http://images.google.com/?extension=surplus&authuser="+(localStorage.auth_user||0);
  if(localStorage.althost != 'no'){
    var xhr = new XMLHttpRequest();
    xhr.open('get', "http://images.google.com/?extension=surplus&authuser="+(localStorage.auth_user||0), true);
    xhr.onload = function(){
      var iHasNotify = xhr.responseText.indexOf('_/notifications/frame') != -1;
      xhr.open('get', "http://video.google.com/?extension=surplus&authuser="+(localStorage.auth_user||0), true);
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
        if(navigator.userAgent.indexOf('Chrome/13.') != -1 && navigator.userAgent.indexOf('Windows') != -1){
          location.href += "?unlucky";
        }else if(!/retry/.test(location.search)){
          location.href += "?retry";
        }else{
          location.href += "?unlucky";
        }
      }
    }, 1000);
  }
}
var heightstate = 0;
var login_error = false;
var visible = true;
var share_visible = false;
var current_user = '';
var last_event = +new Date;
var global_port;
var global_port_src = '';
var global_inner_port;
var baseheight = 525;
var connect_times = 0;
var last_recorded_number = -1;
var last_recorded_time = +new Date;
var last_updated_time = 0;
var update_queued = false;
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
  if(!global_inner_port && !low_memory){
    console.log("loaded popup and notification port not found")
    setTimeout(function(){
      if(!global_inner_port) location.reload();
    }, 3141) //this is pi
  }
  if(localStorage.smartshare != 'no'){
    if(old_num == 0){
      open_share();
    }else{
      ensure_open();
    }
  }else{
    if(!share_visible){
      ensure_open();
    }
  }
}
function evacuate(){
  console.log("Evacuate");
  //if(!share_visible) ensure_closed();
  if(low_memory){
    frame.src = 'about:blank';
    frame.parentNode.removeChild(frame);
    delete frame;
    frame = null;
  }else{
    console.log('restoring window')
    document.adoptNode(frame);
    document.body.appendChild(frame);
    close_tainted = true;
  }
}




function ensure_popup(state){
  console.log("ensuring state", state);
  last_event = +new Date;
  if(state == true && share_visible){
    close_share();
  }
  global_port.postMessage({action: 'winstate', state: state});
  shift_frame();
  share_visible = false;
  if(global_inner_port){
    global_inner_port.postMessage({action: 'sharevisible', value: share_visible})
  }
  visible = state;
  setTimeout(manualUpdate, 1000);
}

function open_share(){
  console.log("Opening Share Window");
  ensure_closed();
  shift_frame()
  share_visible = true;
  if(localStorage.nocurrentpage == 'yes'){
    global_inner_port.postMessage({action: 'sharevisible', value: share_visible})
    global_port.postMessage({action: 'share', visible: share_visible});
  }else{
    chrome.tabs.getSelected(null, function(tab){
      console.log("Got current tab", tab)      
      
      global_inner_port.postMessage({action: 'sharevisible', value: share_visible, current_url: tab.url})
      global_port.postMessage({action: 'share', visible: share_visible});
    })
  }
  
}

function close_share(){
  console.log("Closing Share Window");
  share_visible = false;
  shift_frame()
  global_inner_port.postMessage({action: 'sharevisible', value: share_visible})
  global_inner_port.postMessage({action: 'sharehide'})
  global_port.postMessage({action: 'share', visible: share_visible});
}

function ensure_open(){
  ensure_popup(true);
}

function ensure_closed(){
  ensure_popup(false);
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
    last_event = +new Date;
  }
  old_num = num;
}



function drawIcon(num){
  num += '';
  if(localStorage.usebadge == 'yes') { 
    chrome.browserAction.setBadgeText({ text:num });
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

chrome.extension.onConnect.addListener(function(port) {
  if(port.name == 'chell'){ // i dont know why i'm naming this after portal 2  characters
    
    console.log("Initialized new Sandbar Port", port);
    global_port = port;
    global_port_src = '';
    global_inner_port = null;
    
    ensure_popup(visible);
    setTimeout(function(){
      if(document.getElementById('frame')){ //check if it is being hosted in the bg
        ensure_closed();
        console.log('ensure closed after check for parenthood');
      }
    }, 100)
    port.onMessage.addListener(function(msg){
      current_user = msg.user;
      if(msg.log){
        console.log('r', msg.log);
      }else if(msg.error){
        login_error = msg.error;
        drawIcon("!!");
      }else{
        if(share_visible && msg.height) frame.style.height = Math.max(msg.height+300, baseheight)+'px';
        
        global_port_src = msg.src;
        if(last_recorded_number != msg.num && (+new Date - last_recorded_time) > 2000){
          setTimeout(manualUpdate, 100);
          last_recorded_time = +new Date;
          last_recorded_number = msg.num;
        }
      }
    })
  }else{ // if(port.name == 'wheatley'){
    //console.log('recieved potential wheatley');
    
    function poll(){
      if(global_port_src){
        //console.log('found global port source', global_port_src, port.name);
        if(global_port_src == port.name){
          setTimeout(function(){
            chrome.browserAction.setPopup({popup:'popup.html'});
            setTimeout(manualUpdate, 100);
          }, 762);
          console.log("Initialized new Notifications Port", port);
          global_inner_port = port;
          port.postMessage({action: 'accept', user: current_user});
          port.onMessage.addListener(function(msg){
            if(msg.action == 'xhr'){
              handleCount(msg.response)
            }else if(msg.action == 'share'){
              open_share();
            }else if(msg.action == 'profile'){
              chrome.tabs.create({url: 'https://plus.google.com/u/'+(localStorage.auth_user||0)+'/'})
            }else if(msg.action == 'shownotifications'){
              ensure_open();
            }else if(msg.action == 'sharevisible' && msg.value == false){
              if(share_visible){
                console.log("Auto Reopen Notifications");
                close_share();
                setTimeout(ensure_open, 100)
              }
            }
          })
        }
      }else setTimeout(poll, 500);
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
      xhr.open('get', 'https://plus.google.com/u/0/_/notifications/getnotificationsdata', true);
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
setInterval(showMessage, 6000); //seems like a good duration

function chromeOS() {
  chrome.windows.create({
    url: "popup.html",
    width: 440,
    height: baseheight,
    type: 'popup'
  })
}

var birthday = +new Date;

setInterval(function(){manualUpdate()}, 20 * 1000);

var close_tainted = false;
setInterval(function(){
  if(!low_memory){
    if(close_tainted && !share_visible && document.getElementById('frame') && (new Date - last_event > 4 * 1000)){ //check if it is being hosted in the bg
      ensure_closed();
      close_tainted = false;
    }
  
    if(new Date - last_event > 18 * 60 * 1000){
      frame.src = frame.src; //reload frame.
    }
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

