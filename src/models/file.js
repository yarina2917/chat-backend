const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema({
  originalName: {
    type: String,
    required: true
  },
  key: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
})

const File = mongoose.model('File', fileSchema)

module.exports = File
