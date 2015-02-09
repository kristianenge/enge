'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ImageSchema = new Schema({
  rawdata: String,
  _id: String,
  active: Boolean
});

module.exports = mongoose.model('Image', ImageSchema);