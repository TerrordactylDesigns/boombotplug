exports.djAdvance = function(boombot, data) {
  console.log(data)
  setTimeout(function() {
    boombot.bot.woot()
  }, 10000)
}

exports.roomJoin = function(boombot, data) {
  console.log(data)
  //boombot.bot.chat('WHO DARES SUMMON BOOMBOT?')
}

exports.userJoin = function(boombot, data) {
  console.log('[userJoin Data]' + JSON.stringify(data))
  if (boombot.config.consolelog)
    console.log('[ User Joined ] : ' + data.username)
  boombot.bot.chat(boombot.config.responses.welcome.replace('XXX', data.username))
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

    for (i =0; i < boombot.commands.length; i++) {
      // parse trigger. If begins with a . make it a matching command
      // if it doesnt start with a . we need to check for it anywhere in the text
      if ((boombot.commands[i].trigger[0] == "." && boombot.commands[i].trigger.toLowerCase() == text.toLowerCase())
        || (boombot.commands[i].trigger[0] != "." && text.toLowerCase().indexOf(boombot.commands[i].trigger.toLowerCase()) != -1 && uid != boombot.config.botinfo.userid)) {
        ran = true
        try {
          boombot.commands[i].script(boombot, text)
        } catch (err) {
          boombot.chat('Your script is bad! Check the log for details.')
          console.log('[ *ERROR* ] Script error: ' + err)
        }
      }
    }
  }
}
