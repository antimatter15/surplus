var port = chrome.extension.connect({name: location.href});
var sharevisible = false;

function mouse(name){
  var evt = document.createEvent("MouseEvents");
  evt.initMouseEvent(name ? ('mouse'+name) : 'click', true, true, window, 0, 0, 0, 1, 1, false, false, false, false, 0, null);
  return evt;
}

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
  }else if(msg.action == "sharevisible"){
    sharevisible = msg.value;
  }else if(msg.action == 'accept'){
    console.log('Recieved acceptance letter.');
    var div = document.querySelector("a[href$='/notifications/all']")
      .parentNode
      .querySelector("div");
    div.innerHTML = "<div id='sharebutton' style='cursor:pointer;background: -webkit-linear-gradient(top,whiteSmoke,#F1F1F1);border: 1px solid rgba(0, 0, 0, 0.1);color: #666;border-radius: 4px;padding:3px 8px;display:inline'>Share</div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+msg.user;
    console.log(div.innerHTML)
    document.getElementById('sharebutton').onclick = function(){
      port.postMessage({action: 'share'})
    }
    
    setInterval(function(){
      var views = document.querySelectorAll("#summary-view>div");
      if(views.length == 2 && views[0].style.display == 'none' && sharevisible){
        port.postMessage({action: "sharevisible", value: false})
        setTimeout(function(){
          document.querySelector("span[title='Add Link']").dispatchEvent(mouse('over'));
                    document.querySelector("span[title='Add Link']").dispatchEvent(mouse('down'));
                              document.querySelector("span[title='Add Link']").dispatchEvent(mouse('up'));
                                        document.querySelector("span[title='Add Link']").dispatchEvent(mouse());
        }, 1000)
      }
    }, 500)
  }
  
})
