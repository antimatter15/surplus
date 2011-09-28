var port = chrome.extension.connect({name: location.href});
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

function focusText(){
  setTimeout(function(){
    document.querySelector("div[contenteditable='plaintext-only']").focus()
  }, 100);
}

function setShareURL(url, force){
  (function(){
    if(document.querySelector("div[contenteditable='plaintext-only']") && document.querySelector("span[title='Add link']").offsetHeight){
      if(document.querySelectorAll("#summary-view>div")[0].querySelector('a[href="'+url+'"]')) return focusText();
      if(!force && document.querySelector("div[contenteditable='plaintext-only']").innerText.trim() != '') return focusText();
      try{
        [].slice.call(document.querySelectorAll("#summary-view>div")[0].querySelectorAll('div[tabindex="0"]'),0)
          .filter(function(e){return(getComputedStyle(e).right=='11px')})[0].dispatchEvent(mouse());
      }catch(err){}
      setTimeout(function(){
        document.querySelector("span[title='Add link']").dispatchEvent(mouse());
        var evt = document.createEvent("KeyboardEvent");
        evt.initEvent ("keypress", true, true, window, 0, 0, 0, 0, 0, 42)
        document.querySelector('td>div>input[type=text]').dispatchEvent(evt);
        document.querySelector('td>div>input[type=text]').value = url;
        if(/https?:/.test(url)){
          setTimeout(function(){
            var addbtn = document.querySelector('td>div div[role=button]');
            addbtn.dispatchEvent(mouse('down'));
            addbtn.dispatchEvent(mouse('up'));
            focusText()
          }, 100)
        }
      }, 100);
    }else setTimeout(arguments.callee, 100);
  })()
}

port.onMessage.addListener(function(msg){
  //console.log('recieved query for notifications')
  if(msg.user && document.getElementById('usersettings')) document.getElementById('usersettings').innerText = msg.user;
  
  if(msg.action == 'xhr'){
    var xhr = new XMLHttpRequest();
    xhr.open('get', msg.url, true);
    xhr.onload = function(){
      port.postMessage({action: 'xhr', response: xhr.responseText})
    }
    xhr.send();
  }else if(msg.action == "sharevisible"){
    var sharevisible = msg.value;
    console.log("Set Sharevisible to", sharevisible);
    
    if(sharevisible == true && msg.current_url){
      setShareURL(msg.current_url);
      if(document.getElementById('plusone_button'))
        document.getElementById('plusone_button').src = chrome.extension.getURL('plusone.html')+'?'+encodeURIComponent(msg.current_url);
      /*
      var el;
      while(el = document.getElementById('plusoneform')) 
        el.parentNode.removeChild(el);
      setTimeout(function(){
        var el;
        while(el = document.getElementById('plusoneform')) 
          el.parentNode.removeChild(el);
        
        var iframe = document.createElement('iframe');
        iframe.id = 'plusoneform';
        iframe.style.border = '0';
        iframe.style.width = '106px';
        iframe.style.height = '24px';
        iframe.src = chrome.extension.getURL('plusone.html')+'?'+encodeURIComponent(msg.current_url);
        var blag = document.getElementById('summary-view').firstChild.childNodes[1];
        blag.insertBefore(iframe, blag.lastChild);
        iframe.style['float'] = 'right';
      }, 762);*/
    }else{
      if(document.getElementById('plusone_button'))
        document.getElementById('plusone_button').src = chrome.extension.getURL('plusone.html');
    }
  }else if(msg.action == 'checkediting'){
    var editing = document.activeElement.isContentEditable&&!!document.activeElement.innerText.trim();
    port.postMessage({action: 'checkediting', value: editing});
    
  }else if(msg.action == "sharehide"){
    console.log("Temporarily Hiding Share box");
    var views = document.querySelectorAll("#summary-view>div");
    views[0].style.visibility = 'hidden';
    setTimeout(function(){
      views[0].style.visibility = 'visible';
    }, 500)
  }else if(msg.action == 'accept'){
    console.log('Recieved acceptance letter.');
    
    var share = document.getElementById('summary-view').firstChild;
    share.style.padding = '0px';
    share.style.paddingLeft = '20px';
    share.style.paddingRight = '20px';
    
    var reminder = document.createElement('div');
    reminder.style.padding = '18px 2px 17px 0px';
    
    reminder.innerHTML = '<a href="javascript:void(0)" id="surplusback"><span style="font-size:110%;font-weight:bold">&#8249; Back to Notifications</span></a> <span style="float:right"> <iframe id="plusone_button" style="margin-bottom: -3px;height:15px;width:70px;border:0" src="'+chrome.extension.getURL('plusone.html')+'"></iframe> <a href="javascript:void(0)" id="sharesurplus">Share</a> Surplus!</span>';
    share.insertBefore(reminder, share.firstChild);
    document.getElementById('sharesurplus').onclick = function(){
      setShareURL("https://chrome.google.com/webstore/detail/pfphgaimeghgekhncbkfblhdhfaiaipf", true);
    }
    document.getElementById('surplusback').onclick = function(){
      /*[].slice.call(
        document.querySelector('#summary-view')
        .firstChild
        .querySelectorAll('div>div>div>div>div>div')
      ,0).filter(function(e){
        return getComputedStyle(e).height == '9px'
      })[0].dispatchEvent(mouse());*/
      port.postMessage({action: 'shownotifications'})
    }
    
  
    var div = document.querySelector("a[href$='/notifications/all']")
      .parentNode
      .querySelector("div");
    div.innerHTML = "<div id='sharebutton' style='cursor:pointer;background: -webkit-linear-gradient(top,whiteSmoke,#F1F1F1);border: 1px solid rgba(0, 0, 0, 0.1);color: #666;border-radius: 4px;width:16px;height:16px;padding:3px 8px;display:inline'>Share</div> <div id='reloadbutton' style='cursor:pointer;background: url(\""+chrome.extension.getURL('img/view-refresh.png')+"\")  2px 3px no-repeat, -webkit-linear-gradient(top,whiteSmoke,#F1F1F1);border: 1px solid rgba(0, 0, 0, 0.1);color: #666;border-radius: 4px;padding:3px 10px;display:inline'></div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span id='usersettings'>"+msg.user+"</span>";
    
    document.getElementById('sharebutton').onclick = function(){
      port.postMessage({action: 'share'})
    }
    document.getElementById('reloadbutton').onclick = function(){
      port.postMessage({action: 'reload'})
    }
    document.getElementById('usersettings').onclick = function(){
      port.postMessage({action: 'profile'})
    }
  }
  
})
