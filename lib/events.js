/**/// Public: single handler for speech and pm
/**///
/**/// Args
/**/// boombot  - an instance of the bot
/**/// data     - ttapi speech/PM data
/**/// private  - bool value for PM
exports.handleCommand = function(boombot, data) {
  console.log(data)
}

exports.djAdvance = function(boombot, data) {
  console.log(data)
}

exports.roomJoin = function(boombot, data) {
  console.log(data)
  boombot.bot.chat('WHO DARES SUMMON BOOMBOT?')
}