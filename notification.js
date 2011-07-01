var port = chrome.extension.connect({name: location.href});

port.onMessage.addListener(function(msg){
  console.log('recieved query for notifications')
  var divs = document.querySelectorAll('#summary-content>div');
  port.postMessage([].slice.call(divs, 0, msg.num).map(function(e){
    return [e.innerText, e.querySelector('img').src]
  }))
})

//console.log('SURPLUS NOTIFIER LOADED', location.href)

/*
window.addEventListener("beforeload", function(event) { 
  console.log("Caught resource load", event.url); 
  if(/notifications\/updatelastreadtimeevent/.test(event.url)){
    //we know this is a update read time event, and we can kill it with fire.
    console.log('killed with fire');
    event.preventDefault();
  }
}, true); 
*/


