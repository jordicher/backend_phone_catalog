const mongoose = require('mongoose')

const Phone = require('../models/Phone')
const { server } = require('../index')
const { api, initialPhones, getAllContentFromPhones } = require('./helpers')

const urlPhones = '/phones'

beforeEach(async () => {
  await Phone.deleteMany({})

  const phone1 = new Phone(initialPhones[0])
  await phone1.save()

  const phone2 = new Phone(initialPhones[1])
  await phone2.save()
})

describe('get phones', () => {
  test('phones are returned as json', async () => {
    await api
      .get(urlPhones)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('phones are two phones', async () => {
    const response = await api.get(urlPhones)
    expect(response.body).toHaveLength(initialPhones.length)
  })

  test('the phone has a name', async () => {
    const { names } = await getAllContentFromPhones()
    expect(names).toContain('iPhone 7')
  }) 
})

describe('get one phone', () => {
  test('a valid id phone can be get', async () => {
    const { response } = await getAllContentFromPhones()
    const phoneToGet = response.body[0]

    api
      .get(`${urlPhones}/${phoneToGet.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

  })

  test('invalid id phone can not be added', async () => {
    await api.get(`${urlPhones}/>Q-ñçÄ<`).expect(400)    
  })
})

describe('post phones', () => {
  test('a valid phone can be added', async () => {
    const newPhone = {
      name: 'Samsung Galaxy A52 5G',
      manufacturer: 'Samsung',
      description:
        'Finding the best price for the Samsung Galaxy A52 5G is no easy task. Here you will find where to buy the Samsung Galaxy A52 5G at the best price. Prices are continuously tracked in over 140 stores so that you can find a reputable dealer with the best price',
      color: 'white',
      price: 369,
      imageFileName: 'Samsung_Galaxy_A52.png',
      screen: '4.7 inch FHD+',
      processor: '	Qualcomm Snapdragon 750G',
      ram: 8
    }

    await api
      .post(urlPhones)
      .send(newPhone)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const { names, response } = await getAllContentFromPhones()
    expect(response.body).toHaveLength(initialPhones.length + 1)
    expect(names).toContain(newPhone.name)
  })

  test('invalid phone can not be added', async () => {
    const newPhone = {
      manufacturer: 'Samsung',
      description:
        'Finding the best price for the Samsung Galaxy A52 5G is no easy task. Here you will find where to buy the Samsung Galaxy A52 5G at the best price. Prices are continuously tracked in over 140 stores so that you can find a reputable dealer with the best price',
      color: 'white'
    }

    await api
      .post(urlPhones)
      .send(newPhone)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const { names, response } = await getAllContentFromPhones()
    expect(response.body).toHaveLength(initialPhones.length)
    expect(names).not.toContain(newPhone.name)
  })
})

describe('delete phones', () => {
  test('a valid phone can be deleted', async () => {
    const { response: firstResponse } = await getAllContentFromPhones()
    const phoneToDelete = firstResponse.body[0]

    await api.delete(`${urlPhones}/${phoneToDelete.id}`).expect(204)

    const { names, response: secondResponse } = await getAllContentFromPhones()
    expect(secondResponse.body).toHaveLength(initialPhones.length - 1)
    expect(names).not.toContain(phoneToDelete.name)
  })

  test('invalid phone can not be added', async () => {
    await api.delete(`${urlPhones}/>Q-ñçÄ<`).expect(400)

    const { response } = await getAllContentFromPhones()

    expect(response.body).toHaveLength(initialPhones.length)
  })
})

describe('update phones', () => {
  test('phone can be updated', async () => {
    const { response: firstResponse } = await getAllContentFromPhones()
    const phoneToEdit = firstResponse.body[0]

    const editPhone = {
      name: 'phone updated'
    }

    await api
      .put(`${urlPhones}/${phoneToEdit.id}`)
      .send(editPhone)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const { names, response: secondResponse } = await getAllContentFromPhones()

    expect(names).not.toContain(phoneToEdit.name)
    expect(names).toContain(editPhone.name)
    expect(firstResponse.body).toHaveLength(secondResponse.body.length)
  })

  test('invalid phone can not be updated', async () => {
    const { response: firstResponse } = await getAllContentFromPhones()
    const phoneToEdit = firstResponse.body[0]

    const editPhone = {
      notField: 'phone updated'
    }

    await api.put(`${urlPhones}/>Q-ñçÄ<`).send(editPhone).expect(400)

    const {response: secondResponse } = await getAllContentFromPhones()

    expect(firstResponse.body).toHaveLength(secondResponse.body.length)
    expect(phoneToEdit).not.toHaveProperty('notField')
  })
})

afterAll(() => {
  mongoose.connection.close() 
  server.close()
})
