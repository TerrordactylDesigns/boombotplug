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
    'script': function(deathbot, text, uname) {
      deathbot.respond('DEATH BOT ' + deathbot.version + ' \n\r Coded by: http://GPlus.to/TerrordactylDesigns/ \n\r Acquire your own at https://github.com/TerrordactylDesigns/deathbot')
    }
  },
  {
    'trigger': '.help',
    'listed': true,
    'script': function(deathbot, text, uname) {
      var response = 'My current commands are: ' + deathbot.commands.filter(function(command) {
        return command.listed
      }).map(function(command){
        return command.trigger
      }).sort().join(', ')
      deathbot.respond(response)
    }
  },
  {
    'trigger': '.album',
    'listed': config.lastfm.use,
    'script': function(deathbot, text, uname) {
      if (deathbot.config.lastfm.use) {
        //get the current artist, then replace blank spaces with underscores
        var currArtist    = deathbot.song.artist.replace(/ /g,'+').replace(/\./g,'')
          , currSong      = deathbot.song.title.replace(/ /g,'+').replace(/\./g,'')
        deathbot.scribble.GetTrackInfo({artist:currArtist,track:currSong}, function(ret) {
          deathbot.respond(ret.track.album.title)
        })
      }
    }
  },
  {
    'trigger': '.artistinfo',
    'listed': false,
    'script': function(deathbot, text, uname) {
      if (deathbot.config.lastfm.use) {
        //get the current artist, then replace blank spaces with underscores
        var currArtist    = deathbot.song.artist.replace(/ /g,'+').replace(/\./g,'')
        deathbot.scribble.GetArtistInfo(currArtist, function(ret) {
          console.log(ret)
          //deathbot.respond(ret.artist.bio.summary)
        })
      }
    }
  },
  {
    'trigger': '.similarartists',
    'listed': config.lastfm.use,
    'script': function(deathbot, text, uname) {
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
            deathbot.respond('Artists similar to ' + currArtist.replace(/\+/g,' ') + ': ' + list)
        }, 3)
      }
    }
  },
  {
    'trigger': '.similarsongs',
    'listed': config.lastfm.use,
    'script': function(deathbot, text, uname) {
      if (deathbot.config.lastfm.use) {
        //get the current artist, then replace blank spaces with underscores
        var currArtist    = deathbot.song.artist.replace(/ /g,'+').replace(/\./g,'')
          , currSong      = deathbot.song.title.replace(/ /g,'+').replace(/\./g,'')
        deathbot.scribble.GetSimilarSongs({artist:currArtist,track:currSong}, function(ret) {
          var list  = ''
            , songs = ret.similartracks.track
          for (var i=0;i<songs.length;i++) {
            list += songs[i].name + ' By: ' + songs[i].artist.name
            list = (i == songs.length - 1) ? list += '.' : list += ','
          }
          deathbot.respond('Songs similar to ' + currSong.replace(/\+/g,' ') + ': ' + list)
        }, 3)
      }
    }
  },
  {
    'trigger': '.lyrics',
    'listed': true,
    'script': function(deathbot, text, uname) {
      var http = require('http')
      //get the current song name and artist, then replace blank spaces with underscores
      var currSong    = deathbot.song.title.replace(/ /g,'_').replace(/\./g,'')
        , currArtist  = deathbot.song.artist.replace(/ /g,'_').replace(/\./g,'')
        , apiCall     = {
                          host: 'lyrics.wikia.com',
                          port: 80,
                          path: '/api.php?artist=' + currArtist + '&song=' + currSong + '&fmt=json'
                        }
      //call the api
      http.get(apiCall, function(res) {
        res.on('data', function(chunk) {
          try {
            //lyrics wiki isnt true JSON so JSON.parse chokes
            var obj = eval('(' + chunk + ')')
            //give back the lyrics. the api only gives you the first few words due to licensing
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
    'script': function(deathbot, text, uname) {
      deathbot.respond(deathbot.config.responses.rules)
    }
  },
  {
    'trigger': '.version',
    'listed': true,
    'script': function(deathbot, text, uname) {
      deathbot.respond('deathbot ' + deathbot.version)
    }
  }//,
  // {
  //   'trigger': '.mods',
  //   'listed': true,
  //   'script': function(deathbot, text, uname) {
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
  //   'script': function(deathbot, text, uname) {
  //     if('theme' in deathbot && deathbot.theme !== null)
		// deathbot.respond('Current theme: '+deathbot.theme+'.')
	 //  else
	 //    deathbot.respond(deathbot.config.responses.notheme)
  //   }
  // }
]