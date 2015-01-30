'use strict';

var _ = require('lodash');
var Project = require('./project.model');

var setCoverImageUrl =function(project){
  project.coverimage  = '/api/projects/'+project._id+'/coverimage';
}
var setImageUrl =function(project,images,runningNumber){
   
  project.images[runningNumber]  = '/api/projects/'+project._id+'/images/'+runningNumber;
}

var setImageUrlForProject =function(project){
   var arrayLength = project.images.length;
    for (var i = 0; i < arrayLength; i++) {
      setImageUrl(project,project.images[i],i);
    }
}



// Get list of projects
exports.index = function(req, res) {
  Project.find({}, '-coverimage' ,function (err, projects) {
    if(err) { return handleError(res, err); }
    var arrayLength = projects.length;
    for (var i = 0; i < arrayLength; i++) {
      setCoverImageUrl(projects[i]);
      setImageUrlForProject(projects[i]);
    }
    return res.json(200, projects);
  });
};

// Get a single project
exports.show = function(req, res) {
  Project.findById(req.params.id, '-coverimage -images' ,function (err, project) {
    if(err) { return handleError(res, err); }
    if(!project) { return res.send(404); }
    console.log('show on '+project._id);
    setCoverImageUrl(project);
    console.log('get on '+project);
    return res.json(project);
  });
};

function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}

exports.getImage = function(req, res) {
  console.log('getImage');
  Project.findById(req.params.id, function (err, project) {
    console.log('getImage on '+project._id);
    if(err) { return handleError(res, err); }
    if(!project) { return res.send(404); }
    
    var img = decodeBase64Image(project.images[req.params.oid]);
    res.writeHead(200, {
      'Content-Type': img.type,
      'Content-Length': img.data.length
    });
    return res.end(img.data,'binary'); 
  });
};

exports.getCoverImage = function(req, res) {
  console.log('getCoverImage');
  Project.findById(req.params.id, function (err, project) {
    console.log('getCoverImage on '+project._id);
    if(err) { return handleError(res, err); }
    if(!project) { return res.send(404); }
    var img = decodeBase64Image(project.coverimage);
    res.writeHead(200, {
      'Content-Type': img.type,
      'Content-Length': img.data.length
    });
    return res.end(img.data,'binary'); 
  });
};

// Creates a new project in the DB.
exports.create = function(req, res) {
  Project.create(req.body, function(err, project) {
    if(err) { return handleError(res, err); }
    return res.json(201, project);
  });
};

// Updates an existing project in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Project.findById(req.params.id, function (err, project) {
    console.log('update on '+project);
    if (err) { return handleError(res, err); }
    if(!project) { return res.send(404); }
    var updated = _.merge(project, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, project);
    });
  });
};

// Deletes a project from the DB.
exports.destroy = function(req, res) {
  Project.findById(req.params.id, function (err, project) {
    if(err) { return handleError(res, err); }
    if(!project) { return res.send(404); }
    project.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}