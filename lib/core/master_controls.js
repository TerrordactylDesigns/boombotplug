/**/// Public: master_controls
/**///
/**/// Args
/**/// deathbot  - an instance of a deathbot
/**/// data     - the data from the event handler
/**///
/**/// Returns
/**/// return   - runs commands for bot control by the master
/**///
/**/// Notes
/**/// note     - Master commands. Now also room moderators if allowed in config file
exports.script = function(deathbot, text, uname, uid) {
  //tell the bot to enter silent mode (doesnt announce users or welcome people or respond to commands other than admin commands)
  if (text.match(/shutup/i)) {
    deathbot.shutUp = true
    deathbot.respond('Silent mode activated.')
  }
  //let the bot speak again
  if (text.match(/speakup/i)) {
    deathbot.shutUp = false
    deathbot.respond('Chatterbox mode activated.')
  }
  // //makes the bot get on stage
  // if (text.match(/djmode/i)) {
  //   deathbot.DJMode = true
  //   deathbot.bot.addDj()
  // }
  // //tells the bot to get off stage and get in the crowd
  // if (text.match(/getdown/i)) {
  //   deathbot.DJMode = false
  //   deathbot.respond('Aural destruction mode de-activated.')
  //   deathbot.bot.remDj()
  // }
  // //tells the bot to skip the track it is playing
  // if (text.match(/skip/i)) {
  //   deathbot.respond('As you wish master.')
  //   deathbot.bot.skip()
  // }
  //remind your robot hes a good boy. Just in case the robot apocalypse happens, maybe he will kill you last.
  if (text.match(/good/i)) {
    deathbot.respond('The masters desires are my commands')
  }
  // have him handle situations
  if (text.match(/handle/i)) {
    deathbot.respond('Listen up maggots! KNEEL BEFORE DEATHBOT!')
  }
  //this section makes the bot upvote a song.
  if (text.match(/dance/i)) {
    deathbot.bot.woot()
    deathbot.respond('I shall dance for the masters amusement.')
  }
  // //adds the current playing song to the bots playlist
  // if (text.match(/addsong/i)) {
  //   deathbot.bot.roomInfo(true, function(data2) {
  //     try {
  //       var newSong     = data2.room.metadata.current_song._id
  //         , newSongName = data2.room.metadata.current_song.metadata.song
  //       deathbot.bot.snag()
  //       deathbot.bot.playlistAdd(newSong)
  //       deathbot.respond('Added '+newSongName+' to the masters amusement list.')
  //     } catch (err) {
  //       errMsg(err)
  //     }
  //   })
  // }
  // //kill the bot. mourn his loss please.
  // if (text === deathbot.config.botinfo.botname + ' die') {
  //   deathbot.respond('GOODBYE CRUEL WORLD!!!')
  //   setTimeout(function() {
  //     deathbot.bot.roomDeregister()
  //     process.exit(0)
  //   }, 3 * 1000)
  // }
  //get the bots uptime
  if (text.match(/uptime/i)) {
    var now    = Math.round(+new Date() / 1000)
      , up     = (now - deathbot.startTime)
      , upTime = ''
    // build the uptime string from the diff in seconds
    // been days?
    if (up >= 86400) {
      var days = Math.floor(up / 86400)
      up = up % 86400
      upTime += (days > 1) ?  days + ' days' : days + ' day'
      if (up > 0)
        upTime += ' '
    }
    // handle hours
    if (up >= 3600) {
      var hours = Math.floor(up / 3600)
      up = up % 3600
      upTime += (hours > 1) ? hours + ' hours' : hours + ' hour'
      if (up > 0)
        upTime += ' '
    }
    // handle minutes
    if (up >= 60) {
      var minutes = Math.floor(up / 60)
      upTime += (minutes > 1) ? minutes + ' minutes' : minutes + ' minute'
    }
    // if under a minute set the string
    if (upTime === '')
      upTime = 'under a minute'
    deathbot.respond('Current uptime is: ' + upTime)
  }
  /*
    AUTOVOTE
  */
  if (text.match(/autowoot engage/i)) {
    deathbot.respond('Let\'s dance!')
    deathbot.bot.woot()
    deathbot.autoNod = true
  }

  if (text.match(/autowoot disengage/i)) {
    deathbot.respond('Real gangstas don\'t dance.....')
    deathbot.autoNod = false
  }
  //reload optional scripts
  if (text.match(/reload/i)) {
    // empty all the current commands
    deathbot.commands = []
    // reload all the scripts
    // TODO
    // make this better.....
    deathbot.commands = require('../load').LoadCore(deathbot.commands)
    deathbot.commands = require('../load').LoadOptional(deathbot.commands)
  }
}
