var port = chrome.extension.connect({name: location.href});

port.onMessage.addListener(function(msg){
  //console.log('recieved query for notifications')
  if(msg.action == 'notifications'){
    var divs = document.querySelectorAll('#summary-content>div');
    port.postMessage({action: 'notifications', messages: [].slice.call(divs, 0, msg.num).map(function(e){
      return [e.innerText, e.querySelector('img').src]
    })})
  }else if(msg.action == 'xhr'){
    var xhr = new XMLHttpRequest();
    xhr.open('get', msg.url, true);
    xhr.onload = function(){
      port.postMessage({action: 'xhr', response: xhr.responseText})
    }
    xhr.send();
  }else if(msg.action == 'accept'){
    console.log('Recieved acceptance letter.');
    var div = document.querySelector("a[href$='/notifications/all']")
      .parentNode
      .querySelector("div");
    div.innerHTML = "<div id='sharebutton' style='cursor:pointer;background: -webkit-linear-gradient(top,whiteSmoke,#F1F1F1);border: 1px solid rgba(0, 0, 0, 0.1);color: #666;border-radius: 4px;padding:3px 8px;display:inline-block'>Share...</div>&nbsp;&nbsp;&nbsp;&nbsp;"+msg.user;
    console.log(div.innerHTML)
    document.getElementById('sharebutton').onclick = function(){
      port.postMessage({action: 'share'})
    }
  }
  
})
