x[0][0][1][0][0][2].map(function(e){return e[1].map(function(k){return [k[2][0], k[1]]})})

x[0][0][1][0][0][2].map(function(e){return e[1][0][1]})

x[0][0][1][0].map(function(e){return e[2].map(function(e){
var verb = {
2: 'commented',
20: "+1'd",
5: 'reshared',
6: 'added you', 
24: 'shared a post',
15: 'mentioned',
33: 'invited you to a hangout',
32: 'invited you'
};
var code = e[1][0][1];
return e[1].map(function(k){return k[2][0]}).join(', ')+' '+(verb[code]||('unknown'+code))
})
})


var verbs = {
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


x[0][0][1][0].map(function(e){ //loop through every notification
  var notifyType = e[6]; //2 = photo, 1 = post
  var thing = notifyType==2?'photo':'post';
  var actions = e[2].map(function(e){ //iterate through the participants
    var code = e[1][0][1];
    var actors = e[1].map(function(k){
      return k[2][0]
    });
    var main;
    if(actors.length > 4){
      main =  actors.slice(0, 3).join(', ') + ' and '+(actors.length - 3)+' others'
    }else{
      main = actors.join(', ');
    }
    
    return main +' '+(verbs[code]||('unknown'+code));
  });
  var act = actions[0];
  if(actions.length > 1){
    if(actions.length > 2) act += ', ' + (actions.slice(1, -1).join(', ');
    act += ' and ' + actions.slice(-1)).replace(/(your|a) \{thing\}/g, 'it')
  }
  return act.replace(/\{thing\}/g, thing)+'.'
})
