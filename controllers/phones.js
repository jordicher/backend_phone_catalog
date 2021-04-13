const phonesRouter = require('express').Router()
const Phone = require('../models/Phone')

const fs = require('fs')
const multer = require('multer')
const upload = multer({ dest: 'public/img' })

phonesRouter.get('/', (request, response, next) => {
  Phone.find({})
    .then((phones) => response.json(phones))
    .catch((error) => next(error))
})

phonesRouter.get('/:id', (request, response, next) => {
  const id = request.params.id
  Phone.findById(id)
    .then((phone) => {
      !phone
        ? response
            .status(404)
            .json({ message: `Wrong id?. Can not find phone with id ${id}.` })
        : response.json(phone)
    })
    .catch((error) => next(error))
})

phonesRouter.post(
  '/upload',
  upload.single('fileImg'),
  (request, response, next) => {
    const typeImg = '.' + request.file.mimetype.split('/')[1]

    fs.renameSync(request.file.path, request.file.path + typeImg)

    response.status(201).json(request.file)
  }
)

phonesRouter.post('/', (request, response, next) => {
  const phone = request.body

  if (
    !phone ||
    !phone.name ||
    !phone.manufacturer ||
    !phone.description ||
    !phone.color ||
    !phone.price ||
    !phone.screen ||
    !phone.processor ||
    !phone.ram
  ) {
    return response
      .status(400)
      .json({
        error: 'fields missings'
      })
      .end()
  }

  const newPhone = new Phone({
    name: phone.name,
    manufacturer: phone.manufacturer,
    description: phone.description,
    color: phone.color,
    price: phone.price,
    imageFileName: phone.imageFileName || 'defaultPhone.png',
    screen: phone.screen,
    processor: phone.processor,
    ram: phone.ram
  })

  newPhone
    .save()
    .then((savedPhone) => response.status(201).json(savedPhone))
    .catch((error) => next(error))
})

phonesRouter.delete('/:id', (request, response, next) => {
  const id = request.params.id

  Phone.findByIdAndDelete(id)
    .then((deletedPhone) => {
      !deletedPhone
        ? response
            .status(404)
            .json({ message: `Wrong id?. Can not delete phone with id ${id}.` })
        : response.status(204).json({ message: 'Phone was deleted' }).end()
    })
    .catch((error) => next(error))
})

phonesRouter.put(
  '/:id',
  upload.single('fileImgPhone'),
  (request, response, next) => {
    const id = request.params.id
    const newPhone = request.body
    if (request.file) {
      const typeImg = '.' + request.file.mimetype.split('/')[1]
      fs.renameSync(request.file.path, request.file.path + typeImg)
    } else {
    }

    Phone.findByIdAndUpdate(id, newPhone, { new: true })
      .then((editedPhone) => {
        !editedPhone
          ? response.status(404).json({
              message: `Wrong id?. Can not update phone with id ${id}`
            })
          : response.json(editedPhone)
      })
      .catch((error) => next(error))
  }
)

module.exports = phonesRouter
