//
// Lets just proof of concept this shall we?
//
// var fs          = require('fs')
//   , config      = loadConfig()
//   , AUTH        = config.botinfo.auth + '=?_expires=' + config.botinfo.expires + '==&user_id=' + config.botinfo.userid + '=&v=STIKLg=='
//   , ROOM        = config.room
//   , PlugAPI     = require('plugapi')
//   , UPDATECODE  = 'fe940c'
//   , bot         = new PlugAPI(AUTH, UPDATECODE)
  

// bot.connect(ROOM)
// bot.on('roomJoin', function() {
//   console.log('joined the room')
//   bot.chat('EVERYBODY CALM THE FUCK DOWN, I\'M HERE!')
// })

// // Log chat
// bot.on('chat', function(data) {
//   //console.log(data)
//   console.log('['+data.from+']: ' + data.message)
// })

// // Can we auto woot?
// bot.on('djAdvance', function(data) {
//   console.log(data)
//   bot.woot()
// })

// function loadConfig() {
//   return JSON.parse(fs.readFileSync('config.json', 'ascii'))
// }

/**/// Public: loadBot
/**///
/**/// Args
/**/// config - parsed config
/**///
/**/// Returns
/**/// bot    - a freshly built shiny new robot
/**///
/**/// Notes
/**/// note   - Duct tapes together a boombot
exports.loadBot = function(config) {
  var robot = require('./lib/robot')
  bot       = robot.launch(
    config.botinfo.auth + '=?_expires=' + config.botinfo.expires + '==&user_id=' + config.botinfo.userid + '=&v=STIKLg==',
    config.updatecode
  )
  return bot
}
/**/// Public: run
/**///
/**/// Args
/**/// bot        - boombot instance
/**/// events     - event handlers
/**/// commands   - array of bot commands
/**/// config     - parsed config.json
/**/// blacklist  - array of blacklist objects
/**/// version    - bot version
/**///
/**/// Returns
/**/// return     - a fully operational battle station
/**///
/**/// Notes
/**/// note       - tells the robot to listen and respond
exports.run = function(bot, events, commands, config, version) {
  var robot = require('./lib/robot')
  return robot.run(bot, events, commands, config, version)
}