module.exports = (error, request, response, next) => {   
  
    if (error.name === 'CastError') {
      response.status(400).json({
        error: 'id used is malformed'
      })
    } else {
      response.status(500).end()
    }
  }
  