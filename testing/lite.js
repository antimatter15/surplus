document.body.innerHTML = '';
//nuke stylesheets
var styles = document.styleSheets, len = styles.length;
while(len){
    var sheet = styles[--len];
    var rules = sheet.cssRules;
    var rlength = rules.length;
    while(rlength) sheet.deleteRule(--rlength);
}


var iframe = document.createElement('iframe');
iframe.style.width = '440px'; //eek it feels like a sin to write this


onmessage = function(e){
    //TODO: start parsing setNotifiationWidgetHeight et al.
    var j = JSON.parse(e.data);
    if(j.s == '_resizeMe'){
        iframe.style.height = j.a[1].height + 'px';
    }else if(j.s == '_ready'){
        frames[0].postMessage('{"s":"__cb","f":"..","c":1,"a":[1,null],"t":"736634887","l":false,"g":true,"r":".."}', 'https://plus.google.com')

        frames[0].postMessage('{"s":"onShowNotificationsOnly","f":"..","c":0,"a":["",{"maxWidgetHeight":114}],"t":"736634887","l":false,"g":true,"r":".."}', 'https://plus.google.com')
        
    }
    console.log(e)
    
}

document.body.appendChild(iframe)
//iframe.src= 'https://plus.google.com/u/0/_/notifications/frame?hl=en&origin=http%3A%2F%2Fwww.google.com&jsh=r%3Bgc%2F23980661-3686120e#pid=13&id=gbsf&parent=http%3A%2F%2Fwww.google.com&rpctoken=736634887&_methods=onError%2ConInfo%2ChideNotificationWidget%2CpostSharedMessage%2CsetNotificationWidgetHeight%2CswitchTo%2CnavigateTo%2CsetNotificationText%2ChandlePosted%2C_ready%2C_close%2C_open%2C_resizeMe';
iframe.src= 'https://plus.google.com/u/0/_/notifications/frame?hl=en&origin=https%3A%2F%2Fplus.google.com&jsh=r%3Bgc%2F23217085-590ae8cc#pid=119&id=gbsf&parent=https%3A%2F%2Fplus.google.com&rpctoken=736634887&_methods=onError%2ConInfo%2ChideNotificationWidget%2CpostSharedMessage%2CsetNotificationWidgetHeight%2CswitchTo%2CnavigateTo%2CsetNotificationText%2ChandlePosted%2C_ready%2C_close%2C_open%2C_resizeMe'


//frames[0].postMessage('{"s":"getVarc","f":"..","c":2,"a":["","base"],"t":"736634887","l":false,"g":true,"r":".."}', 'https://plus.google.com')

