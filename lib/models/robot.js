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
  this.db           = null
  this.useDb        = this.config.database.use
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
  var list  = []
    , pos   = 0
    , self  = this
  function pushSlices(txt) {
    var chunk = txt
    if (chunk.length < 255) {
      list.push(chunk)
    } else {
      list.push(chunk.slice(0, 253))
      chunk = chunk.slice(253)
      pushSlices(chunk)
    }
  }
  pushSlices(text)
  for (var i=0;i<list.length;i++) {
    setTimeout(function(){
      self.bot.sendChat(list[pos])
      pos++
    }, (1+1) * 100)
  }
}

module.exports = Robot
