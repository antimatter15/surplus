/*
,
{
  "matches": ["https://plus.google.com/_/apps-static/_/js/*"],
  "js": ["xhr.js"],
	"run_at": "document_start",
  "all_frames": true
}
*/
var script = document.createElement('script');
script.type = 'text/javascript';
script.innerHTML = ';('+(function(){
  XMLHttpRequest.prototype.__open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.__send = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function(type, url, async){
    this.__url = url;
    this.__open(type, url, async)
  }
  XMLHttpRequest.prototype.send = function(data){
    if(/updatelastreadtime/.test(this.__url)){
      chrome.extension.sendRequest({action: 'readtime', url: this.__url}, function(response) {
        if(response == true) this.__send(data);        
      });
    }else{
      this.__send(data)
    }
  }
}).toString()+')();'
document.documentElement.appendChild(script);
