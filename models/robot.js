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
var Robot = function(boombot, events, commands, config, version) {
  this.bot          = boombot
  this.config       = config
  this.events       = events
  this.commands     = commands
  //this.modCommands  = require('../lib/core/admin_controls')
  this.theUsersList = {}
  this.shutUp       = false
  this.snagCounter  = 0
  this.DJMode       = false
  this.yank         = false
  this.autoNod      = false
  this.nextUp       = {}
  this.version      = version
  this.scrobble     = null
  this.startTime    = Math.round(+new Date() / 1000)
  this.scribble     = (this.config.lastfm.use) ? new Scribble(this.config.lastfm.API_key, this.config.lastfm.secret, this.config.lastfm.username, this.config.lastfm.password) : null
}

module.exports = Robot
