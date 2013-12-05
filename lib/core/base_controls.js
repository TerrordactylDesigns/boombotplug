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
    'trigger': '.boombot',
    'listed': true,
    'script': function(boombot, text) {
      boombot.bot.chat('BOOM BOT ' + boombot.version + ' \n\r Coded by: http://GPlus.to/TerrordactylDesigns/ \n\r Acquire your own at https://github.com/TerrordactylDesigns/boombot')
    }
  },
  {
    'trigger': '.version',
    'listed': true,
    'script': function(boombot, text) {
      boombot.bot.chat('BOOMBOT ' + boombot.version)
    }
  },
  {
    'trigger': '.rules',
    'listed': true,
    'script': function(boombot, text) {
      boombot.bot.chat(boombot.config.responses.rules)
    }
  },
  {
    'trigger': '.commands',
    'listed': true,
    'script': function(boombot, text) {
      var response = 'My current commands are: ' + boombot.commands.filter(function(command) {
        return command.listed
      }).map(function(command){
        return command.trigger
      }).sort().join(', ')
      boombot.bot.chat(response)
    }
  },
  {
    'trigger': '.lyrics',
    'listed': true,
    'script': function(boombot, text) {
      var http = require('http')
        , song = boombot.bot.getMedia()

      //get the current song name and artist, then replace blank spaces with underscores
      var currSong    = song.title.replace(/ /g,'_').replace(/\./g,'')
        , currArtist  = song.author.replace(/ /g,'_').replace(/\./g,'')
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
            boombot.bot.chat(obj.lyrics)
            //return the url to the full lyrics
            boombot.bot.chat(obj.url)
          } catch (err) {
            boombot.bot.chat(err)
          }
        })
      }).on('error', function(e) {
        boombot.bot.chat('[ ERROR ]: ' + e.message)
      })
    }
  },
  {
    'trigger': '.artistinfo',
    'listed': config.lastfm.use,
    'script': function(boombot, text) {
      if (boombot.config.lastfm.use) {
        var http = require('http')
          , song = boombot.bot.getMedia()
        if (song.author !== undefined) {
          //get the current artist, then replace blank spaces with underscores
          var currArtist = song.author.replace(/ /g,'+').replace(/\./g,'')
          boombot.scribble.GetArtistInfo(currArtist, function(ret) {
            boombot.bot.chat(ret.artist.bio.summary)
          })
        }
      }
    }
  },
  {
    'trigger': '.similarartists',
    'listed': config.lastfm.use,
    'script': function(boombot, text) {
      if (boombot.config.lastfm.use) {
        var http = require('http')
          , song = boombot.bot.getMedia()
        if (song.author !== undefined) {
          //get the current artist, then replace blank spaces with underscores
          var currArtist = song.author.replace(/ /g,'+').replace(/\./g,'')
          boombot.scribble.GetSimilarArtists(currArtist, function(ret) {
            var artist  = ret.similarartists.artist
              , list    = ''
              for (var i=0;i<artist.length;i++) {
                list += artist[i].name
                list = (i == artist.length - 1) ? list += '.' : list += ','
              }
              boombot.bot.chat('Artists similar to ' + currArtist.replace(/\+/g,' ') + ': ' + list)
          }, 3)
        }
      }
    }
  },
  {
    'trigger': '.similarsongs',
    'listed': config.lastfm.use,
    'script': function(boombot, text) {
      if (boombot.config.lastfm.use) {
        var http = require('http')
          , song = boombot.bot.getMedia()
        if (song.author !== undefined) {
          //get the current artist, then replace blank spaces with underscores
          var currArtist    = song.author.replace(/ /g,'+').replace(/\./g,'')
            , currSong      = song.title.replace(/ /g,'+').replace(/\./g,'')
          boombot.scribble.GetSimilarSongs({artist:currArtist,track:currSong}, function(ret) {
            var list  = ''
              , songs = ret.similartracks.track
              console.log(songs)
            for (var i=0;i<songs.length;i++) {
              list += songs[i].name + ' By: ' + songs[i].artist.name
              list = (i == songs.length - 1) ? list += '.' : list += ','
            }
            boombot.bot.chat('Songs similar to ' + currSong.replace(/\+/g,' ') + ': ' + list)
          }, 3)
        }
      }
    }
  }
]