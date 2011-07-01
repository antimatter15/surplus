var port = chrome.extension.connect({name: location.href});

port.onMessage.addListener(function(msg){
  console.log('recieved query for notifications')
  var divs = document.querySelectorAll('#summary-content>div');
  port.postMessage([].slice.call(divs, 0, msg.num).map(function(e){
    return [e.innerText, e.querySelector('img').src]
  }))
})
