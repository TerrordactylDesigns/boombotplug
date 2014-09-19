/*
  Event handlers for TTAPI events
*/
/**/// Public: roomChangedEvent
/**///
/**/// Args
/**/// deathbot  - an instance of the bot
/**/// data     - ttapi roomChanged data
exports.roomJoin = function(deathbot, data){
  // // log room entrance to console if config is set to true
  if (deathbot.config.consolelog)
    console.log('[ Entrance ] : %s', data)

  var users = deathbot.bot.getUsers()
  for (var i=0;i<users.length;i++) {
    var DJ = require('../models/dj')
      , user = new DJ(users[i].username, users[i].id)
    deathbot.theUsersList[user.userid] = user
    if (deathbot.config.consolelog) {
      console.log('[ EVENT ] : added ' + user.name + ' to theUsersList')
    }
    //build vote log
    if (users[i].grab) deathbot.grabs++
    if (users[i].vote !== 0) deathbot.votes.push({i:user.userid, v: users[i].vote})
  }

}
/**/// Public: registeredEvent
/**///
/**/// Args
/**/// deathbot  - an instance of the bot
/**/// data     - ttapi registered data
exports.userJoin = function(deathbot, data) {
  // //log registration to console if config is set to true
  if (deathbot.config.consolelog)
    console.log('[ Registered ] : %s', data.username)

  //add user to the users list object
  var DJ = require('../models/dj')
    , user = new DJ(data.username, data.id)
  deathbot.theUsersList[user.userid] = user
  if (deathbot.config.consolelog)
    console.log('[ EVENT ] : added ' + user.name + ' to theUsersList')

  //chat announcer
  if (deathbot.shutUp == false) {
    if (data.id == deathbot.config.botinfo.userid) //deathbot announces himself
      deathbot.respond(deathbot.config.responses.botwelcome)
    else if (data.id == deathbot.config.admin.userid) //if the master arrives announce him specifically
      deathbot.respond(deathbot.config.responses.adminwelcome)
    else {
      //check to see if the user is a mod, if not PM them
      if (data.level >= 5) { //user is a room mod
        deathbot.respond(deathbot.config.responses.modwelcome.replace('XXX', data.username))
      } else {
        deathbot.respond(deathbot.config.responses.welcome.replace('XXX', data.username)) //welcome the rest
      }
    }
  }
}
/**/// Public: deregisteredEvent
/**///
/**/// Args
/**/// deathbot  - an instance of the bot
/**/// data     - ttapi deregistered data
exports.userLeave = function(deathbot, data) {
  delete deathbot.theUsersList[data.id]
}
/**/// Public: update_votesEvent
/**///
/**/// Args
/**/// deathbot  - an instance of the bot
/**/// data     - ttapi update_votes data
exports.voteUpdate = function(deathbot, data) {
  function position(val, arr) {
    for (var i=0;i<arr.length;i++) {
      if (val === arr[i].i) return i
    }
    return -1
  }
  console.log('1.' + position(data.i, deathbot.votes))
  var pos = position(data.i, deathbot.votes)
  if (pos > -1) deathbot.votes[pos] = data
  else deathbot.votes.push(data)

  if (data.v === -1) {
    var uid = data.i
    deathbot.respond(deathbot.theUsersList[uid].name + ' meh\'d your song. You two should fight....')
  }
}
/**/// Public: newsongEvent
/**///
/**/// Args
/**/// deathbot  - an instance of the bot
/**/// data     - ttapi newsong data
exports.djAdvance = function(deathbot, data) {
  var up    = 0
    , down  = 0
  for (var i=0;i<deathbot.votes.length;i++) {
    if (deathbot.votes[i].v === -1) down++
    if (deathbot.votes[i].v === 1) up++
  }
  deathbot.votes  = []
  if (deathbot.song) {
    deathbot.respond(deathbot.song.title + ' by ' + deathbot.song.artist + ' got ' +
              up + ' :+1:, ' + down + ' :-1:, and ' + deathbot.grabs + ' :star:')
  }
  deathbot.grabs    = 0
  deathbot.song = {
    title: data.media.title,
    artist: data.media.author
  }

  if (deathbot.autoNod) {
    setTimeout(function(){
      deathbot.bot.woot()
    }, 10 * 1000)
  }
  
  // var currSong    = data.room.metadata.current_song.metadata.song
  //   , currArtist  = data.room.metadata.current_song.metadata.artist
  // /*
  //   Twitter! Social!
  // */
  // if (deathbot.config.twitter.tweet) {
  //   // Tweet the new song. Give the DJ name, the song, and #turntablefm hashtag, and room url
  //   var twitter = require('ntwitter')
  //     , twit    = new twitter({
  //     consumer_key: deathbot.config.twitter.consumer_key,
  //     consumer_secret: deathbot.config.twitter.consumer_secret,
  //     access_token_key: deathbot.config.twitter.access_token_key,
  //     access_token_secret: deathbot.config.twitter.access_token_secret
  //   });
  //   try {
  //     deathbot.bot.roomInfo(true, function(data) {
  //       var currDJ = deathbot.theUsersList[data.room.metadata.current_dj].name;
  //       twit
  //       .verifyCredentials(function (err, data) {
  //         console.log(data);
  //       })
  //       .updateStatus(currDJ + ' is now playing ' + currSong + ' by: ' + currArtist + ' #turntablefm ' + deathbot.config.twitter.roomurl,
  //         function (err, data) {
  //           console.log(data);
  //         }
  //       );
  //     });
  //   } catch (err) {
  //       deathbot.bot.speak(err.toString());
  //   }
  // }
  // /*
  //   Last FM! Scrobble!
  // */
  // if (deathbot.config.lastfm.use && deathbot.config.lastfm.scrobble && data.room.metadata.current_song.metadata.length > 30) {
  //   var song      = {artist:currArtist, track:currSong}
  //     , timer     = data.room.metadata.current_song.metadata.length / 2 < 60 * 4 ? data.room.metadata.current_song.metadata.length / 2 : 60 * 4
  //     , self      = this
  //   // update now playing
  //   deathbot.scribble.NowPlaying(song)
  //   // Last.fm scrobble guidelines
  //   // scrobble after 50% of the song or 4 minutes
  //   // whichever is shorter
  //   // store the current song to compare against when its scrobble time
  //   deathbot.scrobble = setTimeout(function() {
  //     deathbot.scrobble = null
  //     deathbot.scribble.Scrobble(song)
  //   }, timer * 1000)
  // }




}
/**/// Public: snaggedEvent
/**///
/**/// Args
/**/// deathbot  - an instance of the bot
/**/// data     - ttapi snagged data
exports.curateUpdate = function(deathbot, data) {
  deathbot.grabs++
  deathbot.respond(deathbot.theUsersList[data].name + ' liked your song a lot. <3')
}
/**/// Public: update_user
/**///
/**/// Args
/**/// deathbot  - an instance of the bot
/**/// data     - ttapi update_user data
exports.update_userEvent = function(deathbot, data) {

}
/**/// Public: booted_user
/**///
/**/// Args
/**/// deathbot  - an instance of the bot
/**/// data     - ttapi booted_user data
exports.booted_userEvent = function(deathbot, data) {
  //talk smack to booted users
  // if (deathbot.shutUp == false)
  //   deathbot.bot.speak(deathbot.config.responses.booteduser)
}
/**/// Public: add_dj
/**///
/**/// Args
/**/// deathbot  - an instance of the bot
/**/// data     - ttapi add_dj data
exports.add_djEvent = function(deathbot, data) {
  
}
/**/// Public: rem_dj
/**///
/**/// Args
/**/// deathbot  - an instance of the bot
/**/// data     - ttapi rem_dj data
exports.rem_djEvent = function(deathbot, data) {

}

exports.chat = function(deathbot, data) {
  var uname = data.raw.un
    , uid   = data.raw.uid
    , text = data.raw.message

  // if ((uid == deathbot.config.admin.userid
  //     || (modArray.indexOf(uid) !== -1 && deathbot.config.moderatorControl))
  //     && text.toLowerCase().indexOf(deathbot.config.botinfo.botname) != -1) {
  if (uid == deathbot.config.admin.userid && text.toLowerCase().indexOf(deathbot.config.botinfo.botname) != -1) {
    var master_controls = require('../lib/core/master_controls').script
    master_controls(deathbot, text, uname)
  } else {
    if (deathbot.shutUp == false) {
      /*
        PEASANT COMMANDS
      */
      for (i =0; i < deathbot.commands.length; i++) {
        // parse trigger. If begins with a / make it a matching command
        // if it doesnt start with a / we need to check for it anywhere in the text
        if ((deathbot.commands[i].trigger[0] == "." && deathbot.commands[i].trigger.toLowerCase() == text.toLowerCase())
          || (deathbot.commands[i].trigger[0] != "." && text.toLowerCase().indexOf(deathbot.commands[i].trigger.toLowerCase()) != -1 && uid != deathbot.config.botinfo.userid)) {
          //ran = true
          try {
            deathbot.commands[i].script(deathbot, text, uname)
          } catch (err) {
            deathbot.respond('Your script is bad! Check the log for details.')
            console.log('[ *ERROR* ] Script error: ' + err)
          }
        }
      }
    }
  }
}

