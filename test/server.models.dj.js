'use strict';

var dj = require('../server/models/dj.js');
var mongoose = require('mongoose')
var DJ = mongoose.model('DJ')

module.exports = function(opts) {

  describe('DJ Model', function() {

    var currentDJ = null;


    it('should create a dj', function(done) {
      var d = new DJ({
        name  : 'test',
        userid  : '1235431534'
      });
      d.save();
      currentDJ = d;
      currentDJ.should.be.an.instanceOf(Object).and.have.property('_id');
      currentDJ.should.be.an.instanceOf(Object).and.have.property('name');
      currentDJ.should.be.an.instanceOf(Object).and.have.property('userid');
      done();
    }); // create

    it('should find by id', function(done) {
      DJ.findById(currentDJ._id, function(err, d) {
        (err === null).should.be.true;
        d.should.be.an.instanceOf(Object).and.have.property('_id');
        d.should.be.an.instanceOf(Object).and.have.property('name');
        d.should.be.an.instanceOf(Object).and.have.property('userid');
        done();
      });
    }); // find by Id

    it('should update the dj model', function(done) {
      DJ.findById(currentDJ._id, function(err, d) {
        d.name = 'test2';
        d.save(function(err) {
          (err === null).should.be.true;
          d.should.be.an.instanceOf(Object).and.have.property('_id');
          d.should.be.an.instanceOf(Object).and.have.property('name');
          d.should.be.an.instanceOf(Object).and.have.property('userid');
          d.computer.should.eql('test2');
          done();
        });
      });
    }); // update

    it('should delete the dj', function(done) {
      DJ.findById(currentDJ._id, function(err, d) {
        d.remove(function(err){
          (err === null).should.be.true;
          done();
        });
      });
    });


  });
}