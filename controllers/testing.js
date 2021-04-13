const testingRouter = require('express').Router()
const Phone = require('../models/Phone')

testingRouter.post('/reset', async (request, response) => {
  await Phone.deleteMany({})

  response.status(204).end()
})

module.exports = testingRouter