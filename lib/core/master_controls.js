/**/// Public: master_controls
/**///
/**/// Args
/**/// boombot  - an instance of a boombot
/**/// data     - the data from the event handler
/**///
/**/// Returns
/**/// return   - runs commands for bot control by the master
/**///
/**/// Notes
/**/// note     - Master commands. Now also room moderators if allowed in config file
exports.script = function(boombot, text) {
  //tell the bot to enter silent mode (doesnt announce users or welcome people or bot.respond to commands other than admin commands)
  if (text.match(/shutup/i)) {
    boombot.shutUp = true
    boombot.bot.chat('Silent mode activated.')
  }
  //let the bot speak again
  if (text.match(/speakup/i)) {
    boombot.shutUp = false
    boombot.bot.chat('Chatterbox mode activated.')
  }
  //makes the bot get on stage
  // if (text.match(/djmode/i)) {
  //   boombot.DJMode = true
  //   boombot.bot.addDj()
  // }
  //tells the bot to get off stage and get in the crowd
  // if (text.match(/getdown/i)) {
  //   boombot.DJMode = false
  //   boombot.bot.chat(uid, 'Aural destruction mode de-activated.')
  //   boombot.bot.remDj()
  // }
  //tells the bot to skip the track it is playing
  // if (text.match(/skip/i)) {
  //   boombot.bot.chat(uid, 'As you wish master.')
  //   boombot.bot.skip()
  // }
  //remind your robot hes a good boy. Just in case the robot apocalypse happens, maybe he will kill you last.
  if (text.match(/good/i)) {
    boombot.bot.chat('The masters desires are my commands')
  }
  //this section makes the bot upvote a song.
  if (text.match(/dance/i)) {
    boombot.bot.woot()
    boombot.bot.chat('I shall dance for the masters amusement.')
  }
  // set the bots avatar
  // if (text.match(/avatar/i)) {
  //   var avatarArray = text.split(boombot.config.botinfo.botname + ' avatar ')
  //     , avatar = avatarArray[1]
  //     , responses = [ 'Form of ..! What the hell am i?'
  //       , 'I feel so pretty now!'
  //       , 'You really want me to dress like this? Creepy.....'
  //       , 'Hey everyone, come see how handsome I look!'
  //       ]
  //     , rndm = Math.floor(Math.random() * 4);
  //   boombot.bot.setAvatar(avatar);
  //   boombot.bot.speak(responses[rndm]);
  // }
  //his dj skillz/dance moves are outta this world
  // if (text.match(/alien up/i)) {
  //   try {
  //     boombot.bot.setAvatar(12)
  //     boombot.bot.chat(uid, 'Alien dance form entered.')
  //   } catch (err) {
  //     boombot.bot.chat(uid, 'I do not have that form master.')
  //   }
  // }
  //adds the current playing song to the bots playlist
  // if (text.match(/addsong/i)) {
  //   boombot.bot.roomInfo(true, function(data2) {
  //     try {
  //       var newSong     = data2.room.metadata.current_song._id
  //         , newSongName = data2.room.metadata.current_song.metadata.song
  //       boombot.bot.snag()
  //       boombot.bot.playlistAdd(newSong)
  //       boombot.bot.chat(uid, 'Added '+newSongName+' to the masters amusement list.')
  //     } catch (err) {
  //       errMsg(err)
  //     }
  //   })
  // }
  //kill the bot. mourn his loss please.
  // if (text === boombot.config.botinfo.botname + ' die') {
  //   boombot.bot.chat(uid, 'GOODBYE CRUEL WORLD!!!')
  //   setTimeout(function() {
  //     boombot.bot.roomDeregister()
  //     process.exit(0)
  //   }, 3 * 1000)
  // }
  //get the bots uptime
  if (text.match(/uptime/i)) {
    boombot.bot.chat('Current uptime is: ' + getUptime(boombot))
  }
  //get the bots statuses
  if (text.match(/status/i)) {
    boombot.bot.chat('Status: Living, Woot: ' + boombot.autoNod + ', Uptime: ' + getUptime(boombot))
  }
  /*
    AUTOVOTE
  */
  if (text.match(/autowoot engage/i)) {
    boombot.bot.chat('CIRCLE PIT!')
    boombot.bot.woot()
    boombot.autoNod = true
  }

  if (text.match(/autowoot disengage/i)) {
    boombot.bot.chat('Real gangstas don\'t dance.....')
    boombot.autoNod = false
  }
  //reload optional scripts
  if (text.match(/reload/i)) {
    // empty all the current commands
    boombot.commands = []
    // reload all the scripts
    // TODO
    // make this better.....
    var load         = require('../load')
    boombot.commands = load.LoadCore(boombot.commands)
    boombot.commands = load.LoadQueue(boombot.commands)
    boombot.commands = load.LoadOptional(boombot.commands)
  }
  /*
    BLACKLISTING
  */
  // if (text.match(/blacklist/i)) {
  //   // need to grab the user name, convert to uid
  //   var uNameArray  = text.split('blacklist ')
  //     , uName       = uNameArray[1]
  //   // since we only have the users name we need to iterate through all the users unfortunately to find their ID
  //   for (user in boombot.theUsersList) {
  //     if (boombot.theUsersList[user].name === uName) {
  //       boombot.bot.bootUser(user, 'Dont come back.')
  //       boombot.bot.speak('please don\'t come back ' + uName)
  //       var bl      = require('../../models/blacklist')
  //         , blUser  = new bl(boombot.theUsersList[user], uname)
  //       boombot.blackList[boombot.theUsersList[user].userid] = blUser
  //       // write to the file
  //       var fs = require('fs')
  //       fs.writeFile('./models/store/blacklist.json', JSON.stringify(boombot.blackList), function(err) {
  //         if (err) {
  //           console.log('[ FILE SAVE ERROR ]: ' + err)
  //         }
  //       })
  //     }
  //   }
  // }
  // if (text.match(/listbans/i)) {
  //   for (banned in boombot.blackList) {
  //     boombot.bot.chat(uid, boombot.blackList[banned].user.name + ' was banned by ' + boombot.blackList[banned].modName + ' on ' + boombot.blackList[banned].date)
  //   }
  // }
}


function getUptime(boombot) {
  var now    = Math.round(+new Date() / 1000)
      , up     = (now - boombot.startTime)
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
    return upTime
}