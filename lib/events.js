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
    var DJ = require('../lib/models/dj')
      , user = new DJ(users[i].username, users[i].id)
    deathbot.theUsersList[user.userid] = user
    if (deathbot.useDb)
      deathbot.db.LogUser(deathbot, user)
    if (deathbot.config.consolelog)
      console.log('[ EVENT ] : added ' + user.name + ' to theUsersList')

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
  var DJ = require('../lib/models/dj')
    , user = new DJ(data.username, data.id)
  deathbot.theUsersList[user.userid] = user
  if (deathbot.useDb)
      deathbot.db.LogUser(deathbot, user)
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
    if (deathbot.useDb) {
      var Song = require('./models/song')
        , song = new Song(deathbot.song.artist
                        , deathbot.song.title
                        , deathbot.song.id
                        , deathbot.song.dj
                        , up
                        , down
                        , deathbot.grabs)
      deathbot.db.LogPlay(deathbot, song)
    }

    deathbot.respond(deathbot.song.title + ' by ' + deathbot.song.artist + ' got ' +
              up + ' :+1:, ' + down + ' :-1:, and ' + deathbot.grabs + ' :star:')
  }
  deathbot.grabs    = 0
  deathbot.song = {
    title: data.media.title,
    artist: data.media.author,
    id: data.media.id,
    dj: data.currentDJ.id
  }

  var dillingerList = [
    'http://onlyhdwallpapers.com/wallpaper/the_dillinger_escape_plan_desktop_3425x2449_hd-wallpaper-655640.jpg',
    'http://sd.keepcalm-o-matic.co.uk/i/keep-calm-and-listen-the-dillinger-escape-plan.png',
    'http://www.musicreview.co.za/wp-content/uploads/2013/07/dillinger-escape-golden-gods.jpg',
    'http://www.thrashhits.com/wpress/wp-content/uploads/2013/05/greg-dep-blood-421x300.jpeg',
    'http://cdn.meme.am/instances/500x/22943680.jpg',
    'http://s2.quickmeme.com/img/f8/f8661519454e2f8573163c2ffe7aa04a49c32e44aee7c5464bfa360917068d02.jpg',
    'http://38.media.tumblr.com/03c601d693e16af9e4be060b31edfce9/tumblr_mywriupWIT1t5gyh0o1_400.gif',
    'https://38.media.tumblr.com/830c1bb6476af2eb547b8b21ce8f4afe/tumblr_nb43n1BBtF1qfhu7fo1_500.gif',
    'https://41.media.tumblr.com/88ff38def0326a39f8cd6adef6f15613/tumblr_nafoyh1Mml1r5wqqmo1_500.jpg',
    'http://38.media.tumblr.com/tumblr_m325mzpSRb1qj42cyo1_500.gif',
    'http://25.media.tumblr.com/3d7a57a28fa59a6c0da2f6ec236902f4/tumblr_mmcq5usncE1qfifs4o1_500.gif',
    'https://secure.static.tumblr.com/e5d776c55e8eae1b11fb9f9a12fe0700/h9zctj9/zy5n1s05c/tumblr_static_dillinger-escape-plan-live-in-the-netherlands.jpg',
    'Now THIS is a god damn song!'
  ]

  if (deathbot.song.artist.toLowerCase() === 'slaughterbox'
      || deathbot.song.artist.toLowerCase() === 'rings of saturn'
      || deathbot.song.artist.toLowerCase() === 'acrania'
      || deathbot.song.artist.toLowerCase() === 'send them to the slaughterhouse') {
    deathbot.respond('https://dl.dropboxusercontent.com/u/51430720/Photo%20Sep%2006%2C%2014%2010%2037.jpg')
  } else if (deathbot.song.artist.toLowerCase() === 'dillinger escape plan'
            || deathbot.song.artist.toLowerCase() === 'the dillinger escape plan') {
    var rndm = Math.floor(Math.random() * dillingerList.length)
    deathbot.respond(dillingerList[rndm])
  }



  if (deathbot.autoNod) {
    setTimeout(function(){
      deathbot.bot.woot()
    }, 10 * 1000)
  }
  
  var currSong    = deathbot.song.title
    , currArtist  = deathbot.song.artist
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
  /*
    Last FM! Scrobble!
  */
  if (deathbot.config.lastfm.use && deathbot.config.lastfm.scrobble && data.media.duration > 30) {
    var song      = {artist:currArtist, track:currSong}
      , timer     = data.media.duration / 2 < 60 * 4 ? data.media.duration / 2 : 60 * 4
      , self      = this
    // update now playing
    deathbot.scribble.NowPlaying(song)
    // Last.fm scrobble guidelines
    // scrobble after 50% of the song or 4 minutes
    // whichever is shorter
    // store the current song to compare against when its scrobble time
    deathbot.scrobble = setTimeout(function() {
      deathbot.scrobble = null
      deathbot.scribble.Scrobble(song)
    }, timer * 1000)
  }




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
    master_controls(deathbot, text, uname, uid)
  } else {
    if (deathbot.shutUp == false) {
      /*
        PEASANT COMMANDS
      */
      for (i =0; i < deathbot.commands.length; i++) {
        // parse trigger. If begins with a . make it a matching command
        // if it doesnt start with a . we need to check for it anywhere in the text
        if ((deathbot.commands[i].trigger[0] == "." && deathbot.commands[i].trigger.toLowerCase() == text.toLowerCase())
          || (deathbot.commands[i].trigger[0] != "." && text.toLowerCase().indexOf(deathbot.commands[i].trigger.toLowerCase()) != -1 && uid != deathbot.config.botinfo.userid)) {
          //ran = true
          try {
            deathbot.commands[i].script(deathbot, text, uname, uid)
          } catch (err) {
            deathbot.respond('Your script is bad! Check the log for details.')
            console.log('[ *ERROR* ] Script error: ' + err)
          }
        }
      }
    }
  }
}

