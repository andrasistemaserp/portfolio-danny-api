const { portfolios, blogs } = require('./data')
const Portfolios = require('../db/models/portfolio')
const Blogs = require('../db/models/blog')

class FakeDB {
  
  async clean() {
    await Portfolios.deleteMany({})
    await Blogs.deleteMany({})
  }
  
  async addData() {
    await Portfolios.create(portfolios)
    await Blogs.create(blogs)
  }
  
  async populate() {
    await this.clean()
    await this.addData()    
  }
  
}

module.exports = new FakeDB();