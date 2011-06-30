It's actually surprisingly interesting how this works.

There's three key parts, the background page, the popup and the content script.

The background page contains an <iframe> which points to Google Blog Search. Google Blog Search was chosen because it had the new Google bar, has few dynamic elements so the page should load quickly, and looks fairly abandoned and probably won't change for future compatibility's sake. Google Blog Search is pointed to a certain URL which fires a specific content script which reformats the page to work better as a popup. 

The content script also periodically polls the DOM for the number of notifications every two seconds and sends it to the background page which uses <canvas> to generate the icon.

When the button is clicked, Chrome opens up the popup element. That popup element then sends a trigger to the background page, which signals to the content script, which then signals Google Blog Search's toolbar to expand the notification section (this internally, sends a signal to create a new iframe within Google which does some fascinating stuff that I don't bother with). 

Then the popup does something pretty interesting. It runs adoptNode, which is part of Webkit's Magic iframe feature. It then transplants the body of the iframe over to that popup.

When the popup is closed, that is, when the unload event is fired, it sends the frame back to the background page.


Timeline (June 30, 2011 EST)

Started project 4:14 PM

4:21 Icon work

4:24 Manifestation

4:36 Content Scripts on hidden frames argh

4:59 Done with styling

5:22 Perfected popup interaction

6:13 Done

7:18 Updating Readme
