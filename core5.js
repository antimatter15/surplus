var comm = document.getElementById('comm');
var customEvent = document.createEvent('Event');
customEvent.initEvent('SurplusCoreEvent', true, true);
function send(data){
    comm.innerText = JSON.stringify(data);
    comm.dispatchEvent(customEvent);
}

//send("Hello World")

function check(){
    console.log("didnt work yet");
    if(typeof iframes == 'undefined') return setTimeout(check, 100);
    setUpMain();
}

check();

var s = document.createElement('script');
s.src = 'https://apis.google.com/js/plusone.js?onload=onPlusOneLoaded_&googleapis=1';
document.body.appendChild(s);


function setUpMain(){
  iframes.setHandler("iframe-style", {onOpen:function(c) {
    console.log("Super Duper", c);
    c.openInto('notifications-target');
  }, onReady:function(a) {
    console.log("onReady")
    
    frame.onShowShareboxOnly()
    //d && i.a.Iframe.K(a, "onShowNotificationsOnly", {maxWidgetHeight:600, isExtension:b})
  }, onClose:function(a) {
    console.log("onClose");
  }}) 
 frame = iframes.open("https://plus.google.com/u/0/_/notifications/frame?surplus=inner#pid=gpnext",
                      {style:"iframe-style"},
                      {sourceid:"gpnext",
                      origin:window.location.origin},
                      {
    setNotificationWidgetHeight:function(c) {
    console.log("setNotificationWidgetHeight", c);
    send({name: "height", height: c})
  }, setNotificationText:function(c, d) {
    
    console.log("setNotificationText  : ",c,d);
    send({name: "text"})
  }, postShareMessage:function() {
    console.log("postShareMessage")
  }, openSharebox:function() {
    console.log("openSharebox")
    
  }, onError:function(c, d) {
    console.log("Error(" + c + ") " + d);
  }, hideNotificationWidget:function() {
    console.log("close")
    frame.onHide();
    frame.onShowNotificationsOnly();
  }, onInfo:function(c) {
    console.log(c)
  }}, function() {
  });
}