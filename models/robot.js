var Scribble = require('scribble')
/**/// Public: Robot
/**///
/**/// Args
/**/// boombot  - a ttapi bot instance
/**/// events   - event router file
/**/// commands - array of commands
/**/// config   - parsed config.json object
/**///
/**/// Returns
/**/// return   - a robot class linked to events, config, commands, and has
/**///            variables set to defaults
var Robot = function(deathbot, events, commands, config, version) {
  this.bot          = deathbot
  this.config       = config
  this.events       = events
  this.commands     = commands
  this.theUsersList = {}
  this.shutUp       = false
  this.grabs        = 0
  this.votes        = []
  this.song         = null
  this.DJMode       = false
  this.yank         = false
  this.autoNod      = false
  this.version      = version
  this.scrobble     = null
  this.startTime    = Math.round(+new Date() / 1000)
  this.scribble     = (this.config.lastfm.use) ? new Scribble(
                                                    this.config.lastfm.API_key, 
                                                    this.config.lastfm.secret, 
                                                    this.config.lastfm.username, 
                                                    this.config.lastfm.password
                                                  ) 
                                                : null
}
/**/// Public: respond
/**///
/**/// Args
/**/// userid   - the users id
/**/// text     - the response
/**/// private  - boolean for pm or chat response
/**///
/**/// Returns
/**/// return   - chat or pm response of command
Robot.prototype.respond = function(text) {
  // if (private)
  //   this.bot.pm(text, userid, function(data) { }) //PM the user
  // else
    this.bot.sendChat(text)
}

module.exports = Robot
