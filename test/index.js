process.env.NODE_ENV = 'test';
var superagent  = require('superagent');
var should      = require('should');
var mongoose    = require('mongoose');
var http        = require('http');
var fs          = require('fs');
//var config      = require('../config.js');
var config    = JSON.parse(fs.readFileSync('config.json', 'ascii'));
var port        = 1234;
var opts        = {};
var app;
var server;
//mongoose.connect(config.db);
opts.port       = port;
opts.http       = http;
opts.should     = should;
opts.superagent = superagent

// SETUP AND TEARDOWN
before(function(done) {
  app       = require(__dirname + './../server/index.js');
  app.set('port', port);
  server    = app.listen(port);
  opts.app  = app;
  done();
});

after(function(done) {
  server.close();
  done();
});

// CONSTANT
describe('[CONSTANT]', function() {
  var constant = 13;
  it('13 should equal 13', function() {
    constant.should.equal(13);
  });
});

// Server
require('./server.js')(opts);

// Models
require('./server.models.dj.js')(opts);
//require('./server.models.artist.js')(opts);
//require('./server.models.song.js')(opts);
// Routes
//require('./server.routes.djs.js')(opts);
//require('./server.routes.artists.js')(opts);
//require('./server.routes.songs.js')(opts);
