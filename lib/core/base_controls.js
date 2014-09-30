/**/// Public: base_controls
/**///
/**/// Returns
/**/// return - array of core commands and functionality for the bot
/**///
/**/// Notes
/**/// note   - Core scripts for users
var config = require('../../config.json')
module.exports = [
  {
    'trigger': '.deathbot',
    'listed': true,
    'script': function(deathbot, text, uname, uid) {
      deathbot.respond('DEATH BOT ' + deathbot.version 
        + ' \n\r Coded by: http://GPlus.to/TerrordactylDesigns/' 
        + ' \n\r Acquire your own at https://github.com/TerrordactylDesigns/deathbot')
    }
  },
  {
    'trigger': '.help',
    'listed': true,
    'script': function(deathbot, text, uname, uid) {
      var response  = 'My current commands are: '
        , list      = []
        , comma     = ''
        , pos       = 0
        , sorted    = deathbot.commands.filter(function(command) {
                        return command.listed
                      }).map(function(command){
                        return command.trigger
                      }).sort()//.join(', ')
      //chat only allows 255 characters so cant use join :(
      for (var i=0;i<sorted.length;i++) {
        comma = (i+1 === sorted.length) ? '' : ', '
        // will the length go past 255 when added?
        if ((response.length + sorted.length + comma.length) > 255) {
          // if yes, push to list and start building part 2
          list.push(response)
          response = sorted[i] + comma
        } else if (i+1 === sorted.length) {
          response += sorted[i] + comma
          list.push(response)
        } else {
          // if no, add it and loop more
          response += sorted[i] + comma
        }
      }
      for (var j=0;j<list.length;j++) {
        setTimeout(function() {
          deathbot.respond(list[pos])
          pos++
        }, (j + 1) * 500)
      }
    }
  },
  {
    'trigger': '.album',
    'listed': config.lastfm.use,
    'script': function(deathbot, text, uname, uid) {
      if (deathbot.config.lastfm.use) {
        //get the current artist, then replace blank spaces with underscores
        var currArtist  = deathbot.song.artist.replace(/ /g,'+').replace(/\./g,'')
          , currSong    = deathbot.song.title.replace(/ /g,'+').replace(/\./g,'')
        deathbot.scribble.GetTrackInfo({artist:currArtist,track:currSong}, function(ret) {
          deathbot.respond(ret.track.album.title)
        })
      }
    }
  },
  {
    'trigger': '.artistinfo',
    'listed': config.lastfm.use,
    'script': function(deathbot, text, uname, uid) {
      if (deathbot.config.lastfm.use) {
        var sum  = ''
        //get the current artist, then replace blank spaces with underscores
        var currArtist = deathbot.song.artist.replace(/ /g,'+').replace(/\./g,'')
        deathbot.scribble.GetArtistInfo(currArtist, function(ret) {
          sum = ret.artist.bio.summary.replace(/(<([^>]+)>)/ig,"").replace(/\n/g, '').trim()
          deathbot.respond(sum)
        })
      }
    }
  },
  {
    'trigger': '.similarartists',
    'listed': config.lastfm.use,
    'script': function(deathbot, text, uname, uid) {
      if (deathbot.config.lastfm.use) {
        //get the current artist, then replace blank spaces with underscores
        var currArtist    = deathbot.song.artist.replace(/ /g,'+').replace(/\./g,'')
        deathbot.scribble.GetSimilarArtists(currArtist, function(ret) {
          var artist  = ret.similarartists.artist
            , list    = ''
            for (var i=0;i<artist.length;i++) {
              list += artist[i].name
              list = (i == artist.length - 1) ? list += '.' : list += ','
            }
            deathbot.respond('Artists similar to ' + currArtist.replace(/\+/g,' ') 
              + ': ' + list)
        }, 3)
      }
    }
  },
  {
    'trigger': '.similarsongs',
    'listed': config.lastfm.use,
    'script': function(deathbot, text, uname, uid) {
      if (deathbot.config.lastfm.use) {
        //get the current artist, then replace blank spaces with underscores
        var currArtist  = deathbot.song.artist.replace(/ /g,'+').replace(/\./g,'')
          , currSong    = deathbot.song.title.replace(/ /g,'+').replace(/\./g,'')
        deathbot.scribble.GetSimilarSongs({artist:currArtist,track:currSong}, function(ret) {
          var list  = ''
            , songs = ret.similartracks.track
          for (var i=0;i<songs.length;i++) {
            list += songs[i].name + ' By: ' + songs[i].artist.name
            list = (i == songs.length - 1) ? list += '.' : list += ','
          }
          deathbot.respond('Songs similar to ' + currSong.replace(/\+/g,' ') 
            + ': ' + list)
        }, 3)
      }
    }
  },
  {
    'trigger': '.lyrics',
    'listed': true,
    'script': function(deathbot, text, uname, uid) {
      var http = require('http')
      //get the current song name and artist, then replace blank spaces with underscores
      var currSong    = deathbot.song.title.replace(/ /g,'_').replace(/\./g,'')
        , currArtist  = deathbot.song.artist.replace(/ /g,'_').replace(/\./g,'')
        , apiCall     = {
                          host: 'lyrics.wikia.com',
                          port: 80,
                          path: '/api.php?artist=' + currArtist + '&song=' 
                          + currSong + '&fmt=json'
                        }
      //call the api
      http.get(apiCall, function(res) {
        res.on('data', function(chunk) {
          try {
            //lyrics wiki isnt true JSON so JSON.parse chokes
            var obj = eval('(' + chunk + ')')
            //give back the lyrics. the api only gives you the first few words 
            //due to licensing
            deathbot.respond(obj.lyrics)
            //return the url to the full lyrics
            deathbot.respond(obj.url)
          } catch (err) {
            deathbot.respond(err)
          }
        })
      }).on('error', function(e) {
        deathbot.respond('[ ERROR ]: ' + e.message)
      })
    }
  },
  {
    'trigger': '.rules',
    'listed': true,
    'script': function(deathbot, text, uname, uid) {
      deathbot.respond(deathbot.config.responses.rules)
    }
  },
  {
    'trigger': '.version',
    'listed': true,
    'script': function(deathbot, text, uname, uid) {
      deathbot.respond('deathbot ' + deathbot.version)
    }
  },
  {
    'trigger': '.topdj',
    'listed': config.database.use,
    'script': function(deathbot, text, uname, uid) {
      if (deathbot.useDb) {
        deathbot.db.GetTopDj(function(dj) {
          deathbot.respond('The top DJ is: ' + dj.name + ' with: ' + dj.woots 
                            + ' woots')
        })
      }
    }
  },
  {
    'trigger': '.topdjs',
    'listed': config.database.use,
    'script': function(deathbot, text, uname, uid) {
      if (deathbot.useDb) {
        deathbot.respond('The top 3 djs by woots are:')
        deathbot.db.GetTopDjs(3, function(djs) {
          var pos = 0
          for (var i = 0; i < 3; i++) {
            setTimeout(function() {
              deathbot.respond((pos + 1) + ': ' + djs[pos].name + ' with ' 
                                + djs[pos].woots + ' woots')
              pos++
            }, (i + 1) * 500)
          }
        })
      }
    }
  },
  {
    'trigger': '.topplay',
    'listed': config.database.use,
    'script': function(deathbot, text, uname, uid) {
      if (deathbot.useDb) {
        deathbot.db.GetTopPlay(function(play) {
          deathbot.respond('The top song played was: ' + play.songTitle + ' by ' 
            + play.artistName + ' which got :+1: ' + play.woots + ' :-1: ' 
            + play.mehs + ' :star: ' + play.grabs + ' played by ' + play.dj)
        })
      }
    }
  },
  {
    'trigger': '.topplays',
    'listed': config.database.use,
    'script': function(deathbot, text, uname, uid) {
      if (deathbot.useDb) {
        deathbot.respond('The top 3 songs played are:')
        deathbot.db.GetTopPlays(3, function(plays) {
          var pos = 0
          for (var i = 0; i < plays.length; i++) {
            setTimeout(function() {
              deathbot.respond((pos + 1) + ': ' + plays[pos].songTitle + ' by ' 
                + plays[pos].artistName + ' :+1:: ' + plays[pos].woots + ' :-1:: ' 
                + plays[pos].mehs + ' :star:: ' + plays[pos].grabs
                + ' played by ' + plays[pos].dj)
              pos++
            }, (i + 1) * 500)
          }
        })
      }
    }
  },
  {
    'trigger': '.mytopplay',
    'listed': config.database.use,
    'script': function(deathbot, text, uname, uid) {
      if (deathbot.useDb) {
        deathbot.db.GetMyTopPlay(uid, function(play) {
          deathbot.respond('Your top song played was: ' + play.songTitle + ' by ' 
            + play.artistName + ' which got :+1: ' + play.woots + ' :-1: ' 
            + play.mehs + ' :star: ' + play.grabs )
        })
      }
    }
  },
  {
    'trigger': '.worstsong',
    'listed': config.database.use,
    'script': function(deathbot, text, uname, uid) {
      if (deathbot.useDb) {
        deathbot.db.GetWorstSong(function(song) {
          deathbot.respond('The worst song played was: ' + song.songTitle + ' by ' 
            + song.artistName + ' which got :+1: ' + song.woots + ' :-1: ' 
            + song.mehs + ' :star: ' + song.grabs
            + ' played by ' + song.dj)
        })
      }
    }
  },
  {
    'trigger': '.worstsongs', //order is fucked
    'listed': config.database.use,
    'script': function(deathbot, text, uname, uid) {
      if (deathbot.useDb) {
        deathbot.respond('The worst 3 songs played are:')
        deathbot.db.GetWorstSongs(3, function(songs) {
          var pos = 0
          for (var i = 0; i < songs.length; i++) {
            setTimeout(function() {
              deathbot.respond((pos + 1) + ': ' + songs[pos].songTitle + ' by ' 
                + songs[pos].artist + ' :+1:: ' + songs[pos].woots + ' :-1:: ' 
                + songs[pos].mehs + ' :star:: ' + songs[pos].grabs
                + ' played by ' + songs[pos].dj)
              pos++
            }, (i + 1) * 500)
          }
        })
      }
    }
  },
  {
    'trigger': '.myworstsong',
    'listed': config.database.use,
    'script': function(deathbot, text, uname, uid) {
      if (deathbot.useDb) {
        deathbot.db.GetMyWorstSong(uid, function(song) {
          deathbot.respond('Your worst song played was: ' + song.songTitle + ' by ' 
            + song.artistName + ' which got :+1: ' + song.woots + ' :-1: ' 
            + song.mehs + ' :star: ' + song.grabs )
        })
      }
    }
  },
  {
    'trigger': '.mostgrabbed',
    'listed': config.database.use,
    'script': function(deathbot, text, uname, uid) {
      if (deathbot.useDb) {
        deathbot.db.GetTopGrab(function(song) {
          deathbot.respond('The top grabbed song was: ' + song.songTitle + ' by ' 
            + song.artistName + ' which got :+1: ' + song.woots + ' :-1: ' 
            + song.mehs + ' :star: ' + song.grabs
            + ' played by ' + song.dj)
        })
      }
    }
  },
  {
    'trigger': '.mostgrabbedsongs',
    'listed': config.database.use,
    'script': function(deathbot, text, uname, uid) {
      if (deathbot.useDb) {
        deathbot.respond('The top 3 songs by grabs are:')
        deathbot.db.GetTopGrabs(3, function(songs) {
          var pos = 0
          for (var i = 0; i < songs.length; i++) {
            setTimeout(function() {
              deathbot.respond((pos + 1) + ': ' + songs[pos].songTitle + ' by ' 
                + songs[pos].artistName + ' :+1:: ' + songs[pos].woots + ' :-1:: ' 
                + songs[pos].mehs + ' :star:: ' + songs[pos].grabs
                + ' played by ' + songs[pos].dj)
              pos++
            }, (i + 1) * 500)
          }
        })
      }
    }
  },
  {
    'trigger': '.mymostgrabbed',
    'listed': config.database.use,
    'script': function(deathbot, text, uname, uid) {
      if (deathbot.useDb) {
        deathbot.db.GetMyTopGrabbed(uid, function(song) {
          deathbot.respond('Your most snagged song was: ' + song.songTitle + ' by ' 
            + song.artistName + ' which got :+1: ' + song.woots + ' :-1: ' 
            + song.mehs + ' :star: ' + song.grabs )
        })
      }
    }
  },
  {
    'trigger': '.mostplayedartist',
    'listed': config.database.use,
    'script': function(deathbot, text, uname, uid) {
      if (deathbot.useDb) {
        deathbot.db.MostPlayedArtist(function(artist) {
          deathbot.respond('The most played artist is: ' + artist.artistName 
            + ' played ' + artist.plays + ' times' )
        })
      }
    }
  },
  {
    'trigger': '.mostplayedartists',
    'listed': config.database.use,
    'script': function(deathbot, text, uname, uid) {
      if (deathbot.useDb) {
        deathbot.respond('The top 3 played artists are:')
        deathbot.db.GetMostPlayedArtists(3, function(artists) {
          var pos = 0
          for (var i = 0; i < 3; i++) {
            setTimeout(function() {
              deathbot.respond((pos + 1) + ': ' + artists[pos].artistName 
                + ' played ' + artists[pos].plays + ' times')
              pos++
            }, (i + 1) * 500)
          }
        })
      }
    }
  },
  {
    'trigger': '.mymostplayedartist',
    'listed': config.database.use,
    'script': function(deathbot, text, uname, uid) {
      if (deathbot.useDb) {
        deathbot.db.MyMostPlayedArtist(uid, function(artist) {
          deathbot.respond('Your most played artist is: ' + artist.artistName 
            + ' played ' + artist.plays + ' times' )
        })
      }
    }
  },
  {
    'trigger': '.mostplayedsong',
    'listed': config.database.use,
    'script': function(deathbot, text, uname, uid) {
      if (deathbot.useDb) {
        deathbot.db.MostPlayedSong(function(song) {
          deathbot.respond('The most played song is: ' + song.songTitle + ' by: ' 
            + song.artistName + ' played ' + song.plays + ' times')
        })
      }
    }
  },
  {
    'trigger': '.mostplayedsongs',
    'listed': config.database.use,
    'script': function(deathbot, text, uname, uid) {
      if (deathbot.useDb) {
        deathbot.respond('The top 3 songs by plays are:')
        deathbot.db.MostPlayedSongs(3, function(songs) {
          var pos = 0
          for (var i = 0; i < 3; i++) {
            setTimeout(function() {
              deathbot.respond((pos + 1) + ': ' + songs[pos].songTitle + ' by ' 
                + songs[pos].artistName + ' played ' + songs[pos].plays + ' times')
              pos++
            }, (i + 1) * 500)
          }
        })
      }
    }
  },
  {
    'trigger': '.mymostplayedsong',
    'listed': config.database.use,
    'script': function(deathbot, text, uname, uid) {
      if (deathbot.useDb) {
        deathbot.db.MyMostPlayedSong(uid, function(song) {
          deathbot.respond('Your most played song is: ' + song.songTitle + ' by: ' 
            + song.artistName + ' played: ' + song.plays + ' times' )
        })
      }
    }
  },
  {
    'trigger': '.roomstats',
    'listed': config.database.use,
    'script': function(deathbot, text, uname, uid) {
      if (deathbot.useDb) {
        deathbot.db.GetRoomStats(function(stats) {
          deathbot.respond('I have heard ' + stats[0] + ' Dj\'s, play ' + stats[1] 
            + ' songs, by ' + stats[2] + ' artists.')
        })
      }
    }
  }
  // {
  //   'trigger': '.mods',
  //   'listed': true,
  //   'script': function(deathbot, text, uname, uid) {
  //     deathbot.bot.roomInfo(true, function(data) {
  //       var modArray = data.room.metadata.moderator_id
  //       if (modArray.length > 0) {
  //         var response = 'Current mods online: '
  //         for (var i=0;i<modArray.length;i++) {
  //           if (deathbot.theUsersList[modArray[i]])
  //             response += deathbot.theUsersList[modArray[i]].name + ', '
  //         }
  //         deathbot.respond(response)
  //       } else {
  //         deathbot.respond('No online mods at the time.')
  //       }
  //     })
  //   }
  // },
  // {
  //   'trigger': '.theme',
  //   'listed': true,
  //   'script': function(deathbot, text, uname, uid) {
  //     if('theme' in deathbot && deathbot.theme !== null)
    // deathbot.respond('Current theme: '+deathbot.theme+'.')
   //  else
   //    deathbot.respond(deathbot.config.responses.notheme)
  //   }
  // }
]