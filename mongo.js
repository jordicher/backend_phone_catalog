require('dotenv').config()
const mongoose = require('mongoose')

const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env
const connectionString = NODE_ENV === 'test' ? MONGO_DB_URI_TEST : MONGO_DB_URI

mongoose
  .connect(
    connectionString,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModofy: false,
      useCreateIndex: true
    }
  )
  .then(() => {
    console.log('conected')
  })
  .catch((error) => console.log(error))
