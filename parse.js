
function parseNotifications(x){
  var verbs = { //
    6: 'added you on Google+',
    32: 'invited you to join Google+',
    1: 'wrote on your profile',
    24: 'shared a {thing} with you',
    2: 'commented on your {thing}',
    3: 'commented on a {thing} you commented on',
    4: 'liked your {thing}',
    20: "+1'd your {thing}",
    21: "+1'd your comment on a {thing}",
    16: 'mentioned you in a {thing}',
    15: 'mentioned you in a comment on a {thing}',
    14: 'commented on a {thing} that you were mentioned in',
    5: 'reshared your {thing}',
    10: 'tagged you in a photo',
    13: 'tagged your photo',
    25: "commented on a {thing} you're tagged in",
    26: "commented on a {thing} you tagged",
    29: "invited you to a new conversation on Google+ Mobile",
    33: "invites you to a hangout"
  }

var last = x[1][1]; //or is it 2?!?!?!? 
//2 seems to be the last time that updatelastreadtime was called
return x[1][0].map(function(e){ //loop through every notification
  var notifyType = e[6]; //2 = photo, 1 = post
  var thingurl = e[7]?('https://plus.google.com/'+e[7][21]):null;
  var thing = (notifyType == 2 ? 'photo' : 'post');
  thing = '<a href="'+thingurl+'" target=_blank>'+thing+'</a>';
  var actlist = [];
  var actions = e[2].map(function(e){ //iterate through the participants
    var code = e[1][0][1]; //retrieve the action code of the first participant in the list
    var actors = e[1].map(function(k){
      //if k[3] - last > 0 emboldenify
      //Profile Address "https://profiles.google.com"+k[2][1]
      //Profile Pic k[2][2]
      //User ID k[2][3]
      //Gender k[2][4]
      var profile = 'https://profiles.google.com'+k[2][1];
      var pic = k[2][2];
      actlist.push(k);
      return '<a href="'+profile+'" target=_blank '+((k[3]-last>0)?'style="font-weight:bold"':'')+'>'+k[2][0]+'</a>';
      return k[2][0]
    });
    var main = actors.join(', ');
    if(actors.length > 4){
      main = actors.slice(0, 3).join(', ') + ', and '+(actors.length - 3)+' others'
    }
    
    return main +' '+(verbs[code]||('did something ('+code+')'));
  });
  var actpic = actlist.sort(function(a, b){
    return b[3] - a[3]
  })[0][2][2];
  var act = actions[0];
  if(actions.length > 1){
    act += (
      ((actions.length > 2)?(', ' + actions.slice(1, -1).join(', ')):'')
      + ', and ' + actions.slice(-1))
    .replace(/(your|a) \{thing\}/g, 'it') //uses pronouns
  }
  return {
      html: act.replace(/\{thing\}/g, thing)+'.',
      unread: e[3] - last > 0,
      url: thingurl,
      pic: actpic
    }
});
}
