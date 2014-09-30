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
exports.launch = function(config) {
  var PlugAPI = require('PlugAPI')
  return new PlugAPI({
    "email": config.botinfo.email,
    "password": config.botinfo.password
  })
}
/**/// Public: run
/**///
/**/// Args
/**/// deathbot  - the instance of the bot
/**/// events   - event handlers
/**/// commands - array of loaded bot scripts
/**/// config   - parsed config.json
/**///
/**/// Returns
/**/// return   - a lean, mean, robot machine
/**///
/**/// Notes
/**/// note     - the main bot and routing of events
exports.run = function(deathbot, events, commands, config, version) {
  var db    = require('./database')
    , Robot = require('./models/robot')
    , robot = new Robot(deathbot, events, commands, config, version)

  if (config.database.use) {
    robot.db = db.initialize(config)
    robot.db.Init(config)
  }

  deathbot.connect(config.roomid)
  /*<><><><><><><><><><><><><><><><><><><>
            API EMITTED EVENTS
  <><><><><><><><><><><><><><><><><><><>*/
  deathbot.on('roomJoin', function(data){ events.roomJoin(robot, data) })
  deathbot.on('userJoin', function(data){ events.userJoin(robot, data) })
  deathbot.on('userLeave', function(data){ events.userLeave(robot, data) })
  deathbot.on('vote', function(data){ events.voteUpdate(robot, data) })
  deathbot.on('advance', function(data){ events.djAdvance(robot, data) })
  //deathbot.on('endsong', function(data){ events.endsongEvent(robot, data) })
  deathbot.on('grab', function(data){ events.curateUpdate(robot, data) })
  //deathbot.on('update_user', function(data){ events.update_userEvent(robot, data) })
  //deathbot.on('booted_user', function(data){ events.booted_userEvent(robot, data) })
  //deathbot.on('add_dj', function(data){ events.add_djEvent(robot, data) })
  //deathbot.on('rem_dj', function(data){ events.rem_djEvent(robot, data) })
  //deathbot.on('pmmed', function(data){ events.handleCommand(robot, data, true) })
  deathbot.on('chat', function(data){ events.chat(robot, data) })

  deathbot.on('crashed', function(data) {
    // my hack to the API code because I ge ta lot of random 1000 errors...
    console.log(data); 
    console.log('WEEEEEEEE');
    // lets kill the process and let forever restart us
    process.exit();
  })
}
