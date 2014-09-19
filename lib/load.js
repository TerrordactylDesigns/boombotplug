var fs = require('fs')
/**/// Public: ParseConfig
/**///
/**/// Args
/**/// filepath       - optional filepath value for testing
/**///
/**/// Returns
/**/// configuration  - return parsed JSON object
/**///
/**/// Notes
/**/// note           - Parses config.json settings
exports.ParseConfig = function(version, filepath) {
  try {
    console.log('*******Loading Configuration*******')
    filepath  = (filepath === undefined) ? 'config.json' : filepath
    config    = JSON.parse(fs.readFileSync(filepath, 'ascii'))
    console.log('*******Configuration Loaded********')
    console.log('***********************************')
    console.log('*********DEATHBOT '+version+'***********')
    console.log('***********************************')
    console.log('*******Initializing Systems********')
    return config
  } catch(err) {
    console.log(err)
    console.log('[ ERROR ] : Error loading config.json. Check that your config file exists and is valid JSON.')
    process.exit(33)
  }
}
/**/// Private: LoadCore
/**///
/**/// Args
/**/// commands   - array of commands
/**/// filepath   - optional filepath value for testing
/**///
/**/// Returns
/**/// return     - for each command in the base_controls array we will build the commands array
/**///
/**/// Notes
/**/// note       - loads core scripts from lib/core
exports.LoadCore = function(commands, filepath) {
  console.log('*******Loading Core Scripts********')
  filepath = (filepath === undefined) ? '../lib/core/base_controls' : filepath
  var base_controls = require(filepath)
  for (i = 0; i < base_controls.length; i++) {
    console.log('Loading: ' + base_controls[i].trigger)
    commands.push(base_controls[i])
  }
  return commands
}
/**/// Private: LoadOptional
/**///
/**/// Args
/**/// commands   - array of commands
/**/// filepath   - optional filepath value for testing
/**///
/**/// Returns
/**/// return     - for each file in the scripts folder we will build the commands array
/**///
/**/// Notes
/**/// note       - loads scripts from optional scripts folder
exports.LoadOptional = function(commands, filepath) {
  try {
    var filenames = fs.readdirSync('./scripts')
    console.log('*****Loading Optional Scripts******')
    for (i = 0; i < filenames.length; i++) {
      if (filenames[i] != '.DS_Store') {
        console.log('Loading: ' + filenames[i])
        var command = require('../scripts/' + filenames[i])
        commands.push({'trigger': command.trigger, 'listed': command.listed, 'script': command.script})
      }
    }
  } catch(err) {
    console.log(err)
    console.log('[ ERROR ] : Error loading script(s). Please fix or remove the failed script(s) shown above')
  }
  return commands
}
