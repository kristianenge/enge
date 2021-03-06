'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProjectSchema = new Schema({
  name: String,
  info: String,
  coverimage: String,
  images: [String],
  active: Boolean
});

module.exports = mongoose.model('Project', ProjectSchema);