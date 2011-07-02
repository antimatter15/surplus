var port = chrome.extension.connect({name: location.href});

port.onMessage.addListener(function(msg){
  console.log('recieved query for notifications')
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
  }
  
})
