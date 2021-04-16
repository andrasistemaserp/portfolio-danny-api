const config = require('../../config')
const mongoose = require('mongoose')

require('./models/portfolio')
require('./models/blog')

exports.connect = () => {

  mongoose.connect(config.URL_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }, (err) => {
    if (err) {
      console.log(err)
    } else {
      console.log('Connected to DB!')
    }
  })
    
}

