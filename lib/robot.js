/**/// Public: launch
/**///
/**/// Args
/**/// auth   - bots auth code
/**/// uid    - bots user id
/**/// room   - room id for the bot to go to
/**///
/**/// Returns
/**/// return - an instance of a bot
/**///
/**/// Notes
/**/// note   - launches a bot into a room
exports.launch = function(auth, code) {
  var plugapi = require('plugapi')
  console.log(auth)
  console.log(code)
  return new plugapi(auth, code)
}
/**/// Public: run
/**///
/**/// Args
/**/// boombot  - the instance of the bot
/**/// events   - event handlers
/**/// commands - array of loaded bot scripts
/**/// config   - parsed config.json
/**///
/**/// Returns
/**/// return   - a lean, mean, robot machine
/**///
/**/// Notes
/**/// note     - the main bot and routing of events
exports.run = function(boombot, events, commands, config, version) {
  console.log('running')
  var Robot = require('../models/robot')
    , robot = new Robot(boombot, events, commands, config, version)

  boombot.connect(config.room)
  /*<><><><><><><><><><><><><><><><><><><>
            API EMITTED EVENTS
  <><><><><><><><><><><><><><><><><><><>*/
  boombot.on('roomJoin', function(data){ events.roomJoin(robot, data) })
  boombot.on('userJoin', function(data){ events.userJoin(robot, data) })
  //boombot.on('deregistered', function(data){ events.deregisteredEvent(robot, data) })
  //boombot.on('update_votes', function(data){ events.update_votesEvent(robot, data) })
  //boombot.on('newsong', function(data){ events.newsongEvent(robot, data) })
  boombot.on('djAdvance', function(data){ events.djAdvance(robot, data) })
  //boombot.on('snagged', function(data){ events.snaggedEvent(robot, data) })
  //boombot.on('update_user', function(data){ events.update_userEvent(robot, data) })
  //boombot.on('booted_user', function(data){ events.booted_userEvent(robot, data) })
  //boombot.on('add_dj', function(data){ events.add_djEvent(robot, data) })
  //boombot.on('rem_dj', function(data){ events.rem_djEvent(robot, data) })
  //boombot.on('pmmed', function(data){ events.handleCommand(robot, data, true) })
  boombot.on('chat', function(data){ events.handleCommand(robot, data) })
}
