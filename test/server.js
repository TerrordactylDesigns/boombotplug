// SERVER
module.exports = function(opts) {

  describe('[SERVER]', function() {

    describe('Launch', function() {
      it('It should start without error', function(done) {
        opts.app.should.be.ok;
        done();
      });
    });

    describe('Root', function() {
      it('It should be listening at localhost:' + opts.port, function(done) {
        opts.superagent.get('http://localhost:' + opts.port)
          .end(function(err, res) {
            (err === null).should.be.true;
            res.statusCode.should.equal(200);
            done();
          });
      });
    });

    describe('API', function() {
      it('It should be listening at localhost:' + opts.port + '/api', function(done) {
        opts.superagent.get('http://localhost:' + opts.port + '/api')
          .end(function(err, res) {
            (err === null).should.be.true;
            res.statusCode.should.equal(200);
            done();
          });
      });
    });

  }); // SERVER

  describe('[/]', function() {
    it('It should server an HTML application at root', function(done) {
        opts.superagent.get('http://localhost:' + opts.port)
          .end(function(err, res) {
            (err === null).should.be.true;
            res.statusCode.should.equal(200);
            res.should.be.html;
            done();
          });
    });
  });
};