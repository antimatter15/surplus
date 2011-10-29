document.body.innerHTML = '';
document.title = "SurplusHost";

var config = {};

var port = chrome.extension.connect({name: "host"});
var iframe = document.createElement('iframe');
iframe.scrolling = 'no';
iframe.width = '100%';
iframe.frameBorder = 'no';

var styles = document.styleSheets, len = styles.length;
while(len){
    var sheet = styles[--len], rules = sheet.cssRules;
    if(rules){
      var rlength = rules.length;
      while(rlength) sheet.deleteRule(--rlength);
    }
}

function send(json){
    var script = document.createElement('script');
    script.innerHTML = 'frames[0].postMessage('+JSON.stringify(JSON.stringify(json))+',"https://plus.google.com");';
    document.body.appendChild(script);
    document.body.removeChild(script);
    //frames[0].postMessage(JSON.stringify(json), 'https://plus.google.com');
}

function showSharebox(){
    hideWidgets()
    send({"s":"onShowShareboxOnly","f":"..","c":0,"a":["",{}]})
}

function showNotifications(){
    hideWidgets()
    send({"s":"onShowNotificationsOnly","f":"..","c":0,"a":["",{"maxWidgetHeight":config.target_height}],"t":"86208861","l":false,"g":true,"r":".."})
}

function hideWidgets(){
    send({"s":"onHide","f":"..","c":0,"a":["",{}]})
}

var container = document.createElement('div');
container.style.position = 'absolute';
container.style.top = '0';
container.style.left = '0';


onmessage = function(e){
    var j = JSON.parse(e.data);
    if(j.s == 'setNotificationWidgetHeight'){
        container.style.height = j.a[1];
        //port.postMessage({action: "resize", height: parseInt(j.a[1]), width: config.target_width});
    }else if(j.s == '_resizeMe'){
        iframe.style.height = j.a[1].height+'px';
        port.postMessage({action: "resize", height: j.a[1].height, width: config.target_width});
    }else if(j.s == '_ready'){
        send({"s":"__cb","f":"..","c":1,"a":[1,null],"t":"86208861","l":false,"g":true,"r":".."});
        send({"s":"getVarc","f":"..","c":2,"a":["","base"],"t":"86208861","l":false,"g":true,"r":".."});
        showSharebox();
    }else if(j.s == 'navigateTo'){
        console.log(j.a[1].url); //this is the magical command to open a tab
    }else if(j.s == 'hideNotificationWidget'){
        showNotifications();
    }else if(j.s == 'setNotificationText'){
        port.postMessage({action: "update"})
    }else if(j.s == 'onInfo'){
        port.postMessage({action: "error", message: j.a[2]});
    }else{
        console.log(j.s,e)
    }
}
container.appendChild(iframe)
document.body.appendChild(container)


port.onMessage.addListener(function(msg){
    if(msg.action == "config"){
        config = msg;
        container.style.width = config.target_width + 'px';
        iframe.src = config.url;
    }else if(msg.action == "hide"){
        hideWidgets();
    }else if(msg.action == "notifications"){
        showNotifications();
    }else if(msg.action == "sharebox"){
        showSharebox();
    }
})
