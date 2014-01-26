exports.djAdvance = function(boombot, data) {
  console.log('[ DJ ADVANCE ] : ' + JSON.stringify(data))
  if (boombot.config.stats) {
    boombot.bot.chat(
      boombot.theUsersList[data.currentDJ].name
      + ' is now playing: ' +
      data.media.title
      + ' By: ' +
      data.media.author
    )
  }
  if (boombot.autoNod) {
    setTimeout(function() {
      boombot.bot.woot()
    }, 10000)
  }
}

exports.roomJoin = function(boombot, data) {
  console.log('[ ROOM ENTER ] : ' + JSON.stringify(data))
  // log room entrance to console if config is set to true
  if (boombot.config.consolelog)
    console.log('[ Entrance ] : ' + data.room.name)
  // Reset the users list object
  boombot.theUsersList = { }
  // add users to the users list object
  var users   = data.room.users
  for (var i=0; i<users.length; i++) {
    var DJ = require('../models/dj')
      , user = new DJ(users[i].username, users[i].id)
    boombot.theUsersList[user.userid] = user
    if (boombot.config.consolelog)
      console.log('[ EVENT ] : added ' + user.name + ' to theUsersList')
  }
}

exports.userJoin = function(boombot, data) {
  console.log('[userJoin Data]' + JSON.stringify(data))
  if (boombot.config.consolelog)
    console.log('[ User Joined ] : ' + data.username)
  if (data.id !== boombot.config.botinfo.fromid)
    boombot.bot.chat(boombot.config.responses.welcome.replace('XXX', data.username))
  else
    boombot.bot.chat(boombot.config.responses.botwelcome)

  var DJ = require('../models/dj')
    , user = new DJ(data.username, data.id)
  boombot.theUsersList[user.id] = user
  console.log('[ USER LIST ] : ' + boombot.theUsersList)
  if (boombot.config.consolelog)
    console.log('[ EVENT ] : added ' + user.name + ' to theUsersList')
}

/**/// Public: single handler for speech and pm
/**///
/**/// Args
/**/// boombot  - an instance of the bot
/**/// data     - ttapi speech/PM data
/**/// private  - bool value for PM
exports.handleCommand = function(boombot, data) {
  console.log(data)
  if (data.fromId !== boombot.config.botinfo.fromid) {
    var text  = data.message
      , ran   = false
    if (boombot.config.consolelog)
      console.log('[ Chat: ] ' + text)
    if (data.fromID === boombot.config.admin.userid) {
      var master_controls = require('../lib/core/master_controls').script
      master_controls(boombot, text)
    } else {
      for (i =0; i < boombot.commands.length; i++) {
        // parse trigger. If begins with a . make it a matching command
        // if it doesnt start with a . we need to check for it anywhere in the text
        if ((boombot.commands[i].trigger[0] == "." && boombot.commands[i].trigger.toLowerCase() == text.toLowerCase())
          || (boombot.commands[i].trigger[0] != "." && text.toLowerCase().indexOf(boombot.commands[i].trigger.toLowerCase()) != -1 
          && uid != boombot.config.botinfo.userid)) {
          ran = true
          try {
            boombot.commands[i].script(boombot, text)
          } catch (err) {
            boombot.bot.chat('Your script is bad! Check the log for details.')
            console.log('[ *ERROR* ] Script error: ' + err)
          }
        }
      }
    }
  }
} // Dear future self, honestly bro.... clean this up... its like a rats nest....


exports.voteUpdate = function(boombot, data) {
  if (boombot.config.consolelog)
    console.log('[ VOTE UPDATE DATA ] : ' + JSON.stringify(data))
  if (data.vote === -1){
    var jerk = boombot.theUsersList[data.id]
    boombot.bot.chat(boombot.config.responses.namedlame.replace('XXXX', jerk.name))
  }

}

exports.userLeave = function(boombot, data) {
  console.log('[ USER LEAVE INFO ] : ' + JSON.stringify(data))
}
