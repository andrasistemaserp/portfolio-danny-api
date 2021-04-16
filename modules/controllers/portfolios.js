const mongoose = require('mongoose');
const Portfolio = mongoose.model('Portfolio')

exports.getPortfolios = async (req, res) => {
  const portfolios = await Portfolio.find({})
  return res.json(portfolios)
}

exports.getPortfoliosById = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id)
    return res.json(portfolio)
  } catch (error) {
    return res.status(422).send(error.message)
  }
}

exports.createPortfolio = async (req, res) => {
  const portfolioData = req.body;
  const userId = req.user.sub //Id origin of auth0.com/User Magnmet/Users user adm
  const portfolio = new Portfolio(portfolioData)
  portfolio.userId = userId;

  try {
    const newPortfolio = await portfolio.save()
    return res.json(newPortfolio)
  } catch (error) {
    return res.status(422).send(error.message)
  }
}

exports.updatePortfolio = async (req, res) => {
  const { body, params: { id } } = req;

  try {
    const updatedPortfolio = await Portfolio.findOneAndUpdate({_id: id}, body, {new: true, runValidators: true})
    return res.json(updatedPortfolio)
  } catch (error) {
    return res.status(422).send(error.message)
  }
}

exports.deletePortfolio = async (req, res) => {
  const { params: { id } } = req;

  try {
    const deletedPortfolio = await Portfolio.findByIdAndRemove({_id: id})
    return res.json({_id: deletedPortfolio.id})
  } catch (error) {
    return res.status(422).send(error.message)
  }
}

