document.body.innerHTML = '';
//nuke stylesheets
var styles = document.styleSheets, len = styles.length;
while(len){
    var sheet = styles[--len];
    var rules = sheet.cssRules;
    var rlength = rules.length;
    while(rlength) sheet.deleteRule(--rlength);
}

function showSharebox(){
    frames[0].postMessage('{"s":"onShowShareboxOnly","f":"..","c":0,"a":["",{}]}', 'https://plus.google.com')
}

function showNotifications(){
    frames[0].postMessage('{"s":"onShowNotificationsOnly","f":"..","c":0,"a":["",{"maxWidgetHeight":458}],"t":"2718281828","l":false,"g":true,"r":".."}', 'https://plus.google.com')
}

function hideWidgets(){
    frames[0].postMessage('{"s":"onHide","f":"..","c":0,"a":["",{}]}', 'https://plus.google.com')
}

var container = document.createElement('div');
container.style.width = '440px';
container.style.height = '300px';
container.style.overflow = 'hidden';
container.style.border = '1px solid gray';
var iframe = document.createElement('iframe');
iframe.scrolling = 'no';

iframe.width = '100%'; //eek it feels like a sin to write this
iframe.frameBorder = 'no';
iframe.style.height = '300px';

onmessage = function(e){
    //TODO: start parsing setNotifiationWidgetHeight et al.
    var j = JSON.parse(e.data);
    if(j.s == 'setNotificationWidgetHeight'){
        container.style.height = j.a[1];
    }else if(j.s == '_resizeMe'){
        iframe.style.height = j.a[1].height+'px';
    }else if(j.s == '_ready'){
        frames[0].postMessage('{"s":"__cb","f":"..","c":1,"a":[1,null]}', 'https://plus.google.com');
        frames[0].postMessage('{"s":"getVarc","f":"..","c":58,"a":["","base"],"t":"2718281828","l":false,"g":true,"r":".."}', 'https://plus.google.com')
        //showNotifications();
    }else if(j.s == 'navigateTo'){
        console.log(j.a[1].url); //this is the magical command to open a tab
    }else if(j.s == 'hideNotificationWidget'){
        //then reopen the default.
    }
    console.log(j.s,e)
    
}
container.appendChild(iframe)
document.body.appendChild(container)
//ha ha, escape methods....
//var houdini = escape("onError,onInfo,hideNotificationWidget,postSharedMessage,setNotificationWidgetHeight,switchTo,navigateTo,setNotificationText,handlePosted,_ready,_close,_open,_resizeMe");
var houdini = escape("onError,onInfo,hideNotificationWidget,postSharedMessage,setNotificationWidgetHeight,switchTo,navigateTo,setNotificationText,handlePosted,_ready,_close,_open,_resizeMe");

iframe.src = 'https://plus.google.com/u/0/_/notifications/frame?hl=en&origin=http%3A%2F%2Fwww.google.com#pid=119&id=gbsf&parent=http%3A%2F%2Fwww.google.com&rpctoken=2718281828&_methods='+houdini;
