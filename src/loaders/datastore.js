const mongoose = require('mongoose')
const config = require('../config/config')

module.exports.connect = () => new Promise((resolve, reject) => {
  console.log('dsadsadasdsa', config.dbUrl)
  mongoose.connect(config.dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }, (err) => {
    if (err) {
      console.error(err)
      return reject(err)
    }
    console.log('Mongo is connected')
    resolve(mongoose)
  })
})
