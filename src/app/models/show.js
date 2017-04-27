'use strict';

import mongoose from 'mongoose';

// create new schema
const schema = new mongoose.Schema({
  title: String,
  days: {
    type: Array, 
    default: [] 
  },
  user_id: String
});

// virtual date attribute
schema.virtual('date').get(() => this._id.getTimestamp());

// assign schema to 'Show'
module.exports = mongoose.model('Show', schema);
