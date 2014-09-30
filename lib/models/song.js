/**/// Public: Song
/**///
/**/// Args
/**/// artist     - Artist
/**/// title      - Title
/**/// songid     - song id
/**/// userid     - user who played
/**/// woots      - woots
/**/// mehs       - mehs
/**/// grabs      - grabs
/**///
/**/// Returns
/**/// return     - Song object
var Song = function(artist, title, songid, userid, woots, mehs, grabs) {
  this.artistName = artist
  this.songTitle  = title
  this.songId     = songid
  this.userId     = userid
  this.woots      = woots
  this.mehs       = mehs
  this.grabs      = grabs
}

module.exports = Song
