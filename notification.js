var port = chrome.extension.connect({name: location.href});
var sharevisible = false;

function mouse(name){
  var evt = document.createEvent("MouseEvents");
  evt.initMouseEvent(name ? ('mouse'+name) : 'click', true, true, window, 0, 0, 0, 1, 1, false, false, false, false, 0, null);
  return evt;
}

document.addEventListener("keydown", function(e){
  if(e.keyCode == 27){
    e.preventDefault();
    e.stopImmediatePropagation();
  }
},true)

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
    if(sharevisible == true && msg.current_url){
       (function(){
          if(document.querySelector("span[title='Add link']").offsetHeight){
            document.querySelector("span[title='Add link']").dispatchEvent(mouse());
            var evt = document.createEvent("KeyboardEvent");
            evt.initEvent ("keypress", true, true, window, 0, 0, 0, 0, 0, 42)
            document.querySelector('td>div>input[type=text]').dispatchEvent(evt);
            document.querySelector('td>div>input[type=text]').value = msg.current_url;
          }else setTimeout(arguments.callee, 100);
        })()
    }
  }else if(msg.action == "sharehide"){
    var views = document.querySelectorAll("#summary-view>div");
    views[0].style.visibility = 'hidden';
    setTimeout(function(){
      views[0].style.visibility = 'visible';
    }, 500)
  }else if(msg.action == 'accept'){
    console.log('Recieved acceptance letter.');
    
    var div = document.querySelector("a[href$='/notifications/all']")
      .parentNode
      .querySelector("div");
    div.innerHTML = "<div id='sharebutton' style='cursor:pointer;background: -webkit-linear-gradient(top,whiteSmoke,#F1F1F1);border: 1px solid rgba(0, 0, 0, 0.1);color: #666;border-radius: 4px;padding:3px 8px;display:inline'>Share</div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span id='usersettings'>"+msg.user+"</span>";
    console.log(div.innerHTML)
    document.getElementById('sharebutton').onclick = function(){
      port.postMessage({action: 'share'})
    }
    document.getElementById('usersettings').onclick = function(){
      //do something
      port.postMessage({action: 'profile'})
    }
    function check_visible(){
      var views = document.querySelectorAll("#summary-view>div");
      if(views.length == 2 && views[0].style.display == 'none' && sharevisible){
        port.postMessage({action: "sharevisible", value: false})
       
      }
    }
    setInterval(check_visible, 500)
    document.addEventListener("click", function(){
      setTimeout(check_visible, 200);
    }, false);
  }
  
})
