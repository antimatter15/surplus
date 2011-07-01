# Surplus

It's actually surprisingly interesting how this works.

There's three key parts, the background page, the popup and the content script.

The background page contains an `<iframe>` which points to Google Blog Search. Google Blog Search was chosen because it had the new Google bar, has few dynamic elements so the page should load quickly, and looks fairly abandoned and probably won't change for future compatibility's sake. Google Blog Search is pointed to a certain URL which fires a specific content script which reformats the page to work better as a popup. 

The content script also periodically polls the DOM for the number of notifications every two seconds and sends it to the background page which uses `<canvas>` to generate the icon.

When the button is clicked, Chrome opens up the popup element. That popup element then sends a trigger to the background page, which signals to the content script, which then signals Google Blog Search's toolbar to expand the notification section (this internally, sends a signal to create a new iframe within Google which does some fascinating stuff that I don't bother with). 

Then the popup does something pretty interesting. It runs `adoptNode`, which is part of Webkit's Magic iframe feature. It then transplants the body of the `iframe` over to that popup.

When the popup is closed, that is, when the `unload` event is fired, it sends the frame back to the background page.

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
* 7:18pm Updating Readme

## TODO:

* Account Switching Support (yes, I actually have multiple accounts but it never occurred to me because my first one is the one I use with google+)
* There's this really annoying problem with scrolling dying every so often. Argh.


## Notes
* As of 11:49am June 31, it no longer uses Google Blog Search, but rather Google Video instead, because Blog Search was neglected more than I like, especially with multi-user stuff.
