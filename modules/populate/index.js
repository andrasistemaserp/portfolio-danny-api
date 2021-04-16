const config = require('../../config')
const mongoose = require('mongoose')
const fakeDB = require('./FakeDB')

mongoose.connect(config.URL_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}, async (err) => {
  if (err) {
    console.log(err)
  } else {
    console.log('Starting populate DB...')
    await fakeDB.populate()
    await mongoose.connection.close()
    console.log('> DB has been populated!')
  }
})

