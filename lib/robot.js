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
  boombot.on('voteUpdate', function(data){ events.voteUpdate(robot, data) })
  boombot.on('userLeave', function(data){ events.userLeave(robot, data) })
  boombot.on('djAdvance', function(data){ events.djAdvance(robot, data) })
  boombot.on('chat', function(data){ events.handleCommand(robot, data) })
}
