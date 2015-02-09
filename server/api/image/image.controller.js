'use strict';

var _ = require('lodash');
var Image = require('./image.model');

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

// Get list of images
exports.index = function(req, res) {
  Image.find(function (err, images) {
    if(err) { return handleError(res, err); }
    return res.json(200, images);
  });
};

// Get a single image
exports.show = function(req, res) {
  Image.findById(req.params.id, function (err, image) {
    if(err) { return handleError(res, err); }
    if(!image) { return res.send(404); }
    if(image.rawdata === null){
      return res.send(404);
    }
    var img = decodeBase64Image(image.rawdata);
    res.writeHead(200, {
      'Content-Type': img.type,
      'Content-Length': img.data.length
    });
    return res.end(img.data,'binary'); 
  });
};

// Get a single image
exports.showEncoded = function(req, res) {
  Image.findById(req.params.id, function (err, image) {
    if(err) { return handleError(res, err); }
    if(!image) { return res.send(404); }
    
    return res.json(200, image); 
  });
};

// Creates a new image in the DB.
exports.create = function(req, res) {
  
  Image.create(req.body, function(err, image) {
    if(err) { return handleError(res, err); }
    return res.json(201, image);
  });
};

// Updates an existing image in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Image.findById(req.params.id, function (err, image) {
    if (err) { return handleError(res, err); }
    if(!image) { return res.send(404); }
    var updated = _.merge(image, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, image);
    });
  });
};

// Deletes a image from the DB.
exports.destroy = function(req, res) {
  Image.findById(req.params.id, function (err, image) {
    if(err) { return handleError(res, err); }
    if(!image) { return res.send(404); }
    image.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}