'use strict';

var should = require('should');
var app = require('../../app');
var Project = require('./project.model');



describe('Project Model', function() {
  before(function(done) {
    // Clear users before testing
    Project.remove().exec().then(function() {
      done();
    });
  });

  afterEach(function(done) {
    Project.remove().exec().then(function() {
      done();
    });
  });

  it('should begin with no users', function(done) {
    Project.find({}, function(err, projects) {
      projects.should.have.length(0);
      done();
    });
  });

  
});
