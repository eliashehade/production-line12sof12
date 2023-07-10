const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  duration: {
    required: true,
    type: Number
  }
});

module.exports = mongoose.model('shopping_categs', dataSchema);
