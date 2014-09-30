var mongojs   = require('mongojs')
  , db
/**/// Public: Init
/**///
/**/// Args
/**/// config   - parsed config.json
/**///
/**/// Notes
/**/// note     - creates database connection
exports.Init = function(config) {
  // open connections to the tables
  db = mongojs.connect(config.database.mongo.username + ':' 
                        + config.database.mongo.password + '@' 
                        + config.database.mongo.path, 
                        ['users', 'songs', 'artists', 'plays'])
  // TODO
  // throw error on failed initialize
}
/**/// Public: LogUser
/**///
/**/// Args
/**/// deathbot  - an instance of the bot
/**/// user     - a user object
/**///
/**/// Notes
/**/// note     - logs a user and increments their visit count
exports.LogUser = function(deathbot, user) {
  if (deathbot.config.consolelog)
    console.log('[MONGO INSERT]')
  try {
    db.users.update({userid: user.userid}, 
                    {$set: {userid: user.userid, name: user.name}, 
                    $inc: { visits: 1}}, {upsert: true})
  } catch (err) {
    console.log('[MONGO ERROR]: ' + err)
  }
}
/**/// Public: LogPlay
/**///
/**/// Args
/**/// deathbot  - an instance of the bot
/**/// song     - a song object
/**///
/**/// Notes
/**/// note     - updates song, artist, and plays table
exports.LogPlay = function(deathbot, song) {
  if (deathbot.config.consolelog)
    console.log('[MONGO INSERT]')
  try {
    db.artists.findAndModify({
      query: { artistName: song.artistName },
      update: { $set: { artistName: song.artistName } },
      new: true,
      upsert: true
    }, function(err, doc) {
      if (err) console.log('[MONGO ERROR]: ' + err)
      var artistId = doc._id
      db.songs.save({
        id: song.songId,
        artistId: artistId,
        songTitle: song.songTitle
      })
      db.plays.save({
        userId: song.userId,
        artistId: artistId,
        songId: song.songId,
        woots: song.woots,
        mehs: song.mehs,
        grabs: song.grabs
      })
    })
  } catch(err) {
    console.log('[MONGO ERROR]: ' + err)
  }
}
/**/// Public: GetTopDj
/**///
/**/// Args
/**/// callback - callback function
/**///
/**/// Returns
/**/// return   - compiled song information object array to callback
exports.GetTopDj = function(callback) {
  try {
    db.plays.aggregate([
      { $group: {
        _id: "$userId",
        total: {$sum: "$woots"}
      }},
      {$sort: {"total": -1}},
      {$limit: 1}
    ], function(err, doc) {
      if (err) console.log('[MONGO ERROR]: ' + err)
      db.users.find({userid: doc[0]._id}, function(err, user) {
        callback({name: user[0].name, woots: doc[0].total})
      })
    })
  } catch(err) {
    console.log('[MONGO ERROR]: ' + err)
  }
}
/**/// Public: GetTopDjs
/**///
/**/// Args
/**/// callback - callback function
/**///
/**/// Returns
/**/// return   - compiled artist info object to callback
exports.GetTopDjs = function(amt, callback) {
  var djs     = []
    , counter = 0

  try {
    db.plays.aggregate([
      { $group: {
        _id: "$userId",
        total: { $sum: "$woots" }
      } },
    {$sort: { "total": -1 } }
    ], function(err, doc) {
      if (err) console.log('[MONGO ERROR]: ' + err)
      doc.forEach(function(err, i) {
        db.users.find({userid: doc[i]._id}, function(err, user) {
          if (err) console.log('[MONGO ERROR]: ' + err)
          djs[i] = {
            name: user[0].name,
            woots: doc[i].total
          }
          if (i+1 === amt && typeof callback === 'function') {
            callback(djs)
          }
        })
      })
    })
  } catch (err) {
    if (err) console.log('[MONGO ERROR]: ' + err)
  }
}
/**/// Public: GetTopSong
/**///
/**/// Args
/**/// callback - callback function
/**///
/**/// Returns
/**/// return   - compiled song information object array to callback
exports.GetTopPlay = function(callback) {
  try {
    db.plays.find().sort({woots:-1}).limit(1).forEach(function(err, doc) {
      if (!doc) return
      // TODO
      // learn to join in mongo and stop this callback nesting
      db.artists.find({_id: doc.artistId}, function(err, artistDoc) {
        if (!artistDoc) return
        db.songs.find({id: doc.songId}, function(err, songDoc) {
          if (!songDoc) return
          db.users.find({userid: doc.userId}, function(err, userDoc) {
            if (!userDoc) return
            if (typeof callback == 'function')
              callback({
                songTitle: songDoc[0].songTitle,
                artistName: artistDoc[0].artistName,
                woots: doc.woots,
                mehs: doc.mehs,
                grabs: doc.grabs,
                dj: userDoc[0].name
              })
          })
        })
      })
    })
  } catch(err) {
    console.log('[MONGO ERROR]: ' + err)
  }
}
/**/// Public: GetTopSongs
/**///
/**/// Args
/**/// amt      - amount of songs to query
/**/// callback - callback function
/**///
/**/// Returns
/**/// return   - compiled song information object array to callback
exports.GetTopPlays = function(amt, callback) {
  var songs   = []
    , counter = 0
  try {
    // TODO
    // find how to ensure this returns in the proper order every time
    db.plays.find().sort({woots:-1}).limit(amt).forEach(function(err, doc) {
      if (!doc) return
      // TODO
      // learn to join in mongo and stop this callback nesting
      db.artists.find({_id: doc.artistId}, function(err, artistDoc) {
        if (!artistDoc) return
        db.songs.find({id: doc.songId}, function(err, songDoc) {
          if (!songDoc) return
          db.users.find({userid: doc.userId}, function(err, userDoc) {
            songs[counter] = {
              songTitle: songDoc[0].songTitle,
              artistName: artistDoc[0].artistName,
              woots: doc.woots,
              mehs: doc.mehs,
              grabs: doc.grabs,
              dj: userDoc[0].name
            }
            counter++
            if (counter === amt && typeof callback == 'function')
              callback(songs)
          })
        })
      })
    })
  } catch(err) {
    console.log('[MONGO ERROR]: ' + err)
  }
}
/**/// Public: GetMyTopSong
/**///
/**/// Args
/**/// userId   - users id
/**/// callback - callback function
/**///
/**/// Returns
/**/// return   - compiled song information object array to callback
exports.GetMyTopPlay = function(userId, callback) {
  try {
    db.plays.find({userId: userId}).sort({woots:-1}).limit(1).forEach(function(err, doc) {
      if (!doc) return
      // TODO
      // learn to join in mongo and stop this callback nesting
      db.artists.find({_id: doc.artistId}, function(err, artistDoc) {
        if (!artistDoc) return
        db.songs.find({id: doc.songId}, function(err, songDoc) {
          if (!songDoc) return
          if (typeof callback == 'function')
            callback({
              songTitle: songDoc[0].songTitle,
              artistName: artistDoc[0].artistName,
              woots: doc.woots,
              mehs: doc.mehs,
              grabs: doc.grabs
            })
        })
      })
    })
  } catch(err) {
    console.log('[MONGO ERROR]: ' + err)
  }
}
/**/// Public: GetWorstSong
/**///
/**/// Args
/**/// callback - callback function
/**///
/**/// Returns
/**/// return   - compiled song information object array to callback
exports.GetWorstSong = function(callback) {
  try {
    db.plays.find().sort({mehs:-1}).limit(1).forEach(function(err, doc) {
      if (!doc) return
      // TODO
      // learn to join in mongo and stop this callback nesting
      db.artists.find({_id: doc.artistId}, function(err, artistDoc) {
        if (!artistDoc) return
        db.songs.find({id: doc.songId}, function(err, songDoc) {
          if (!songDoc) return
          db.users.find({userid: doc.userId}, function(err, userDoc) {
            if (!userDoc) return
            if (typeof callback == 'function')
              callback({
                songTitle: songDoc[0].songTitle,
                artistName: artistDoc[0].artistName,
                woots: doc.woots,
                mehs: doc.mehs,
                grabs: doc.grabs,
                dj: userDoc[0].name
              })
          })
        })
      })
    })
  } catch(err) {
    console.log('[MONGO ERROR]: ' + err)
  }
}
/**/// Public: GetWorstSongs
/**///
/**/// Args
/**/// amt      - amount of songs to query
/**/// callback - callback function
/**///
/**/// Returns
/**/// return   - compiled song information object array to callback
exports.GetWorstSongs = function(amt, callback) {
  var songs   = []
    , counter = 0
  try {
    // TODO
    // find how to ensure this returns in the proper order every time
    db.plays.find().sort({mehs:-1}).limit(amt).forEach(function(err, doc) {
      if (!doc) return
      // TODO
      // learn to join in mongo and stop this callback nesting
      db.artists.find({_id: doc.artistId}, function(err, artistDoc) {
        if (!artistDoc) return
        db.songs.find({id: doc.songId}, function(err, songDoc) {
          if (!songDoc) return
          db.users.find({userid: doc.userId}, function(err, userDoc) {
            if(!userDoc) return
            songs[counter] = {
              songTitle: songDoc[0].songTitle,
              artist: artistDoc[0].artistName,
              woots: doc.woots,
              mehs: doc.mehs,
              grabs: doc.grabs,
              dj: userDoc[0].name
            }
            counter++
            if (counter === amt && typeof callback == 'function')
              callback(songs)
          })
        })
      })
    })
  } catch(err) {
    console.log('[MONGO ERROR]: ' + err)
  }
}
/**/// Public: GetMyWorstSong
/**///
/**/// Args
/**/// userId   - users id
/**/// callback - callback function
/**///
/**/// Returns
/**/// return   - compiled song information object array to callback
exports.GetMyWorstSong = function(userId, callback) {
  try {
    db.plays.find({userId: userId}).sort({mehs:-1}).limit(1).forEach(function(err, doc) {
      if (!doc) return
      // TODO
      // learn to join in mongo and stop this callback nesting
      db.artists.find({_id: doc.artistId}, function(err, artistDoc) {
        if (!artistDoc) return
        db.songs.find({id: doc.songId}, function(err, songDoc) {
          if (!songDoc) return
          if (typeof callback == 'function')
            callback({
              songTitle: songDoc[0].songTitle,
              artistName: artistDoc[0].artistName,
              woots: doc.woots,
              mehs: doc.mehs,
              grabs: doc.grabs
            })
        })
      })
    })
  } catch(err) {
    console.log('[MONGO ERROR]: ' + err)
  }
}
/**/// Public: GetTopGrab
/**///
/**/// Args
/**/// callback - callback function
/**///
/**/// Returns
/**/// return   - compiled song information object array to callback
exports.GetTopGrab = function(callback) {
  try {
    // TODO
    // find how to ensure this returns in the proper order every time
    db.plays.find().sort({grabs:-1}).limit(1).forEach(function(err, doc) {
      if (!doc) return
      // TODO
      // learn to join in mongo and stop this callback nesting
      db.artists.find({_id: doc.artistId}, function(err, artistDoc) {
        if (!artistDoc) return
        db.songs.find({id: doc.songId}, function(err, songDoc) {
          if (!songDoc) return
          db.users.find({userid: doc.userId}, function(err, userDoc) {
            if(!userDoc) return
            if (typeof callback == 'function')
              callback({
                songTitle: songDoc[0].songTitle,
                artistName: artistDoc[0].artistName,
                woots: doc.woots,
                mehs: doc.mehs,
                grabs: doc.grabs,
                dj: userDoc[0].name
              })
          })
        })
      })
    })
  } catch(err) {
    console.log('[MONGO ERROR]: ' + err)
  }
}
/**/// Public: GetTopSnagged
/**///
/**/// Args
/**/// amt      - amount of songs to query
/**/// callback - callback function
/**///
/**/// Returns
/**/// return   - compiled song information object array to callback
exports.GetTopGrabs = function(amt, callback) {
  var songs   = []
    , counter = 0
  try {
    // TODO
    // find how to ensure this returns in the proper order every time
    db.plays.find().sort({grabs:-1}).limit(amt).forEach(function(err, doc) {
      if (!doc) return
      // TODO
      // learn to join in mongo and stop this callback nesting
      db.artists.find({_id: doc.artistId}, function(err, artistDoc) {
        if (!artistDoc) return
        db.songs.find({id: doc.songId}, function(err, songDoc) {
          if (!songDoc) return
          db.users.find({userid: doc.userId}, function(err, userDoc) {
            if(!userDoc) return
            songs[counter] = {
              songTitle: songDoc[0].songTitle,
              artistName: artistDoc[0].artistName,
              woots: doc.woots,
              mehs: doc.mehs,
              grabs: doc.grabs,
              dj: userDoc[0].name
            }
            counter++
            if (counter === amt && typeof callback == 'function')
              callback(songs)
          })
        })
      })
    })
  } catch(err) {
    console.log('[MONGO ERROR]: ' + err)
  }
}
/**/// Public: GetMyTopSnagged
/**///
/**/// Args
/**/// userId   - users id
/**/// callback - callback function
/**///
/**/// Returns
/**/// return   - compiled song information object array to callback
exports.GetMyTopGrabbed = function(userId, callback) {
  try {
    db.plays.find({userId: userId}).sort({grabs:-1}).limit(1).forEach(function(err, doc) {
      if (!doc) return
      // TODO
      // learn to join in mongo and stop this callback nesting
      db.artists.find({_id: doc.artistId}, function(err, artistDoc) {
        if (!artistDoc) return
        db.songs.find({id: doc.songId}, function(err, songDoc) {
          if (!songDoc) return
          if (typeof callback == 'function')
            callback({
              songTitle: songDoc[0].songTitle,
              artistName: artistDoc[0].artistName,
              woots: doc.woots,
              mehs: doc.mehs,
              grabs: doc.grabs
            })
        })
      })
    })
  } catch(err) {
    console.log('[MONGO ERROR]: ' + err)
  }
}
/**/// Public: MostPlayedArtist
/**///
/**/// Args
/**/// callback - callback function
/**///
/**/// Returns
/**/// return   - compiled artist info object to callback
exports.MostPlayedArtist = function(callback) {
  try {
    db.plays.aggregate([
      { $group: {
        _id: "$artistId",
        total: { $sum: 1 }
      } },
    {$sort: { "total": -1 } },
    { $limit: 1 }
    ], function(err, doc) {
      if (err) console.log('[MONGO ERROR]: ' + err)
      db.artists.find({_id: doc[0]._id}, function(err, artistDoc) {
        if (err) console.log('[MONGO ERROR]: ' + err)
        if (typeof callback === 'function')
          callback({
            artistName: artistDoc[0].artistName,
            plays: doc[0].total
          })
      })
    })
  } catch (err) {
    if (err) console.log('[MONGO ERROR]: ' + err)
  }
}
/**/// Public: GetMostPlayedArtists
/**///
/**/// Args
/**/// callback - callback function
/**///
/**/// Returns
/**/// return   - compiled artist info object to callback
exports.GetMostPlayedArtists = function(amt, callback) {
  var artists = []
    , counter = 0

  try {
    db.plays.aggregate([
      { $group: {
        _id: "$artistId",
        total: { $sum: 1 }
      } },
    {$sort: { "total": -1 } }
    ], function(err, doc) {
      if (err) console.log('[MONGO ERROR]: ' + err)
      doc.forEach(function(err, i) {
        db.artists.find({_id: doc[i]._id}, function(err, artistDoc) {
          if (err) console.log('[MONGO ERROR]: ' + err)
          artists[i] = {
            artistName: artistDoc[0].artistName,
            plays: doc[i].total
          }
          if (i+1 === amt && typeof callback === 'function') {
            callback(artists)
          }
        })
      })
    })
  } catch (err) {
    if (err) console.log('[MONGO ERROR]: ' + err)
  }
}
/**/// Public: MyMostPlayedArtist
/**///
/**/// Args
/**/// callback - callback function
/**///
/**/// Returns
/**/// return   - compiled artist info object to callback
exports.MyMostPlayedArtist = function(userId, callback) {
  try {
    db.plays.aggregate([
      {"$match": { "userId" : userId } },
      { "$group": {
        "_id": "$artistId",
        "total": { "$sum": 1 }
      } },
      {"$sort": { "total": -1 } },
      { "$limit": 1 }
    ], function(err, doc) {
      if (err) console.log('[MONGO ERROR]: ' + err)
      db.artists.find({_id: doc[0]._id}, function(err, artistDoc) {
        if (err) console.log('[MONGO ERROR]: ' + err)
        if (typeof callback === 'function')
          callback({
            artistName: artistDoc[0].artistName,
            plays: doc[0].total
          })
      })
    })
  } catch (err) {
    if (err) console.log('[MONGO ERROR]: ' + err)
  }
}
/**/// Public: MostPlayedSong
/**///
/**/// Args
/**/// callback - callback function
/**///
/**/// Returns
/**/// return   - compiled song info object to callback
exports.MostPlayedSong = function(callback) {
  try {
    db.plays.aggregate([
      { $group: {
        _id: {songId: "$songId", artistId: "$artistId"},
        total: { $sum: 1 }
      } },
      {$sort: { "total": -1 } },
      { $limit: 1 }
    ], function(err, doc) {
      if (err) console.log('[MONGO ERROR]: ' + err)
      db.artists.find({_id: doc[0]._id.artistId}, function(err, artistDoc) {
        if (err) console.log('[MONGO ERROR]: ' + err)
        db.songs.find({id: doc[0]._id.songId}, function(err, songDoc) {
          if (err) console.log('[MONGO ERROR]: ' + err)
          if (typeof callback === 'function')
            callback({
              artistName: artistDoc[0].artistName,
              plays: doc[0].total,
              songTitle: songDoc[0].songTitle
            })
        })
      })
    })
  } catch (err) {
    if (err) console.log('[MONGO ERROR]: ' + err)
  }
}
/**/// Public: MostPlayedSongs
/**///
/**/// Args
/**/// callback - callback function
/**///
/**/// Returns
/**/// return   - compiled song info object to callback
exports.MostPlayedSongs = function(amt, callback) {
  var songs = []
    , loop  = 0
  try {
    db.plays.aggregate([
      { $group: {
        _id: {songId: "$songId", artistId: "$artistId" },
        total: { $sum: 1 }
      } },
      {$sort: { "total": -1 } }
    ], function(err, doc) {
      if (err) console.log('[MONGO ERROR]: ' + err)
        doc.forEach(function(err, i) {
          db.artists.find({_id: doc[i]._id.artistId}, function(err, artistDoc) {
            if (err) console.log('[MONGO ERROR]: ' + err)
            db.songs.find({id: doc[i]._id.songId}, function(err, songDoc) {
              if (err) console.log('[MONGO ERROR]: ' + err)
              songs[i] = {
                artistName: artistDoc[0].artistName,
                plays: doc[i].total,
                songTitle: songDoc[0].songTitle
              }
              if (i+1 === amt && typeof callback === 'function')
                callback(songs)
            })
          })
        })
    })
  } catch (err) {
    if (err) console.log('[MONGO ERROR]: ' + err)
  }
}
/**/// Public: MyMostPlayedSong
/**///
/**/// Args
/**/// callback - callback function
/**///
/**/// Returns
/**/// return   - compiled artist info object to callback
exports.MyMostPlayedSong = function(userId, callback) {
  try {
    db.plays.aggregate([
      {"$match": { "userId" : userId } },
      { "$group": {
        _id: {songId: "$songId", artistId: "$artistId"},
        "total": { "$sum": 1 }
      } },
      {"$sort": { "total": -1 } },
      { "$limit": 1 }
    ], function(err, doc) {
      if (err) console.log('[MONGO ERROR]: ' + err)
      db.artists.find({_id: doc[0]._id.artistId}, function(err, artistDoc) {
        if (err) console.log('[MONGO ERROR]: ' + err)
        db.songs.find({id: doc[0]._id.songId}, function(err, songDoc) {
          if (err) console.log('[MONGO ERROR]: ' + err)
          var song = {
            artistName: artistDoc[0].artistName,
            plays: doc[0].total,
            songTitle: songDoc[0].songTitle
          }
          if (typeof callback === 'function')
            callback(song)
        })
      })
    })
  } catch (err) {
    if (err) console.log('[MONGO ERROR]: ' + err)
  }
}
/**/// Public: GetRoomStats
/**///
/**/// Args
/**/// callback - callback function
/**///
/**/// Returns
/**/// return   - compiled room statistics array to callback
exports.GetRoomStats = function(callback) {
  var roomStats = []
  try {
    // TODO
    // fix callback hell
    db.users.count(function(err, djCount) {
      if (err) console.log('[MONGO ERROR]: ' + err)
      roomStats[0] = djCount
      db.songs.count(function(err, songCount) {
        if (err) console.log('[MONGO ERROR]: ' + err)
        roomStats[1] = songCount
        db.artists.count(function(err, artistCount) {
          if (err) console.log('[MONGO ERROR]: ' + err)
          roomStats[2] = artistCount
          if (typeof callback === 'function')
            callback(roomStats)
        })
      })
    })
  } catch(err) {
    console.log('[MONGO ERROR]: ' + err)
  }
}
