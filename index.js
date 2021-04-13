require('dotenv').config()
require('./mongo')

const express = require('express')
const cors = require('cors')

const phonesRouter = require('./controllers/phones')

const notFound = require('./middleware/notFound')
const handleError = require('./middleware/handleError')

const app = express()
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true })) //

app.use('/phones', phonesRouter)

app.use('/static', express.static(__dirname + '/public'))

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/phone/testing', testingRouter)
}

app.use(notFound)
app.use(handleError)

const PORT = process.env.PORT || 4002
const server = app.listen(PORT, () => {
  console.log(`server running on ${PORT}`)
})

module.exports = { app, server }
