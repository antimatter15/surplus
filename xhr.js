/*
,
{
  "matches": ["https://plus.google.com/_/apps-static/_/js/*"],
  "js": ["xhr.js"],
	"run_at": "document_start",
  "all_frames": true
}
*/
var sharedElement = document.createElement('div');
sharedElement.style.display = 'none';
sharedElement.id = 'SurplusSharedElement'
document.documentElement.appendChild(sharedElement);

var customEvent = document.createEvent('Event');
customEvent.initEvent('surplusXHRResponse', true, true);

var script = document.createElement('script');
script.type = 'text/javascript';
script.innerHTML = ';('+(function(){
  var callbacks = {};
  
  var sharedElement = document.getElementById('SurplusSharedElement');
  sharedElement.addEventListener('surplusXHRResponse', function(){
    var s = JSON.parse(sharedElement.innerText);
    console.log(s);
    callbacks[s[0]](s[1]);
  })
  var customEvent = document.createEvent('Event');
  customEvent.initEvent('surplusXHRFound', true, true);
  
  
  XMLHttpRequest.prototype.__open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.__send = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function(type, url, async){
    this.__url = url;
    this.__open(type, url, async)
  }
  XMLHttpRequest.prototype.send = function(data){
    if(/updatelastreadtime/.test(this.__url)){
      var xhr = this;
      var cbstr = Math.random().toString(36).substr(3);
      callbacks[cbstr] = function(result){
        if(result == true){
          xhr.__send(data);
        }
      }
      sharedElement.innerText = cbstr;
      sharedElement.dispatchEvent(customEvent);
    }else{
      this.__send(data)
    }
  }
}).toString()+')();'
document.documentElement.appendChild(script);


sharedElement.addEventListener('surplusXHRFound', function(){
  var cbstr = sharedElement.innerText;
  chrome.extension.sendRequest({action: 'readtime', url: this.__url}, function(response) {
    sharedElement.innerText = JSON.stringify([cbstr, response]);
    sharedElement.dispatchEvent(customEvent);
  })
})
