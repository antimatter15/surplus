# Surplus

It's actually surprisingly interesting how this works.

### Contributors


Jerome Dane - option to use classic Google+ icon and badge


corylulu - document.write surplus iframe

### Squeezing Google into a popup

The background page contains an `<iframe>` which points to Google Video Search. Google Video Search (it used to be Google Blog Search until a few issues were encountered with multiple sign-ins) was chosen because it had the new Google bar, has few dynamic elements so the page should load quickly, and looks fairly abandoned and probably won't change for future compatibility's sake. Google Video Search is pointed to a certain URL which fires a specific content script which reformats the page to work better as a popup.  (`http://video.google.com/?extension=surplus`)

When the button is clicked, Chrome opens up the popup window, `popup.html`. That popup element then sends a trigger to the background page, which forwards the signal to the content script, which then signals Google Video Search's toolbar to expand the notification section. This is done by locating the element and then firing the click event through createEvent and dispatchEvent. Internally, this sends a signal to create a new iframe within Google which does some fascinating stuff that I don't bother with learning more about.

Then the popup does something pretty interesting. It runs `adoptNode`, which is part of Webkit's Magic iframe feature. It then transplants the body of the `iframe` over to that popup. It tries fifteen times at 100ms intervals in case the frame is in limbo or something.

When the popup is closed, that is, when the `unload` event is fired, it sends the frame back to the background page. That way, loading the popup is practically instantaneous. The consequence of this is that the frame is loaded persistently and Google's rather large and bloated code uses *a lot* of memory, especially after a while. 

### Notifications

The content script which runs on Google Video also periodically polls the DOM for the number of notifications every half second and sends it to the background page through a persistent chrome port. This doesn't happen to be necessarily real time, and has in practice demonstrated to be a somewhat unreliable system for finding the current number of notifications.

So, this system, relying on the normal Google routines, is unreliable. Sometimes it's near-real time. Sometimes it never changes. Ever. That's why this only functions as the auxiliary notification checker.

The main checking routine is done by a HTTP request to `https://plus.google.com/u/0/_/n/guc`, which gets the number of notifications periodically, every fifteen seconds or if the signal by the auxiliary checker is fired. 

Once that's found, it uses `<canvas>` to generate an icon and to update the button. At about the same time, it opens the panel and then tells the sub-frame content script to grab the current notifications. After getting those notifications, it adds it to a queue for display.

There's a six second interval timer that picks up notifications and alerts the first thing on the queue if it's not the same as the last alerted message.

### Sub-frame Content Script

When the Google+ bar is loaded, it creates an iframe to a certain google plus location. This iframe is on a different domain than the google bar host, and so the domain communication is probably done by something similar to OpenSocial/Wave.

The content script is attached to all Google plus alert boxes on Google Video. It opens a port to the background page to check if that frame's source is the same as the frame which hosts the google bar. 

Once the check passes, the DOM is modified. It inserts the Share button and the account name. It searches for the notification div and just replaces it's contents. It adds a DOM listener to the share button. When the share button is clicked, it sends a message on the port to the background and then it ferries it along to the content script to click the invisible share button and hide the notifications panel.

Also, the content script periodically polls the DOM to check if the share element is hidden. If it's hidden when it is predicted to not be, then it sends a signal the the background which makes it briefly flash the share element before hiding it. This fixes some weird quirks with eating the notifications panel.

There's another function of the content script, and that is to bypass some cross domain oddities. At one point I noticed that the requests to `https://plus.google.com/u/0/_/n/guc` would result in redirects, perhaps some filtering based on referrer or origin. To circumvent this, we send the request through the sub-frame content script to request from within Google+'s domain. 

The main function of the sub-frame content script is to grab the current notifications. It scrapes the DOM and sends it over.

## Name

As for the name, in the twelve seconds between when I knew I was going to start the project and was going to start coding, I had to answer what was probably the hardest problem of any project: finding a name. I figured why not do a `cat /usr/share/dict/words | grep plus`, just because I heard a cool pun about Google+ yesterday. There were basically three words, nonplus, plush and surplus. Plush is cute because I kept thinking of my giant stuffed pikachu that I got when I was six, but the connection between plush and plus is pretty abstract. Nonplus means, literally "confused", and that's not something any interaction designer would want. Surplus is nice, because it has this mythical fairy tale property (US government having a surplus?) and that's a nice (warm and cuddly like a pikachu) connotation. So thereafter, a project was named.

## Timeline (June 30, 2011 EST)

* `4:14pm` Started project 
* `4:21pm` Icon work
* `4:24pm` Manifestation
* `4:36pm` Content Scripts on hidden frames argh
* `4:59pm` Done with styling
* `5:22pm` Perfected popup interaction
* `6:13pm` Done
* `7:18pm` Updating Readme


## TODO

* I switched to TextMate for development half way and it's changing all my spaces to tabs inconsistently, so the code looks terrible. Eek.

## Notes
* As of 11:49am June 31, it no longer uses Google Blog Search, but rather Google Video instead, because Blog Search was neglected more than I like, especially with multi-user stuff.
