/**/// Public: DJ
/**///
/**/// Args
/**/// name   - Dj name
/**/// userid - Dj user id
/**///
/**/// Returns
/**/// return - A Dj object for queue and event processing
var DJ = function(name, userid) {
  this.name       = name
  this.userid     = userid
}

module.exports = DJ
