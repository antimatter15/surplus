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
  XMLHttpRequest.prototype.open = function(type, url, async){
    console.log(type, url, async)
    if(/updatelastreadtime/.test(url)){
      
    }else{
      this.__open(type, url, async)
    }
  }
}).toString()+')();'
document.documentElement.appendChild(script);
