/**/// Public: initialize
/**///
/**/// Args
/**/// boombot - a boombot instance
/**///
/**/// Returns
/**/// return - initializes database connections if needed
exports.initialize = function(config) {
  // Determine what database setup is chosen
  // this only runs when database is set on so just assume configs fine....
  if (config.database.mongo.use)
    return require('./db/mongo')
  else if (config.database.mysql.use)
    return require('./db/mysql')
  else if (config.database.sqlite.use)
    return require('./db/sqlite')
}