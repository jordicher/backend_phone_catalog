const { app } = require('../index')
const supertest = require('supertest')

const api = supertest(app)

const initialPhones = [
  {
    name: 'iPhone 7',
    manufacturer: 'Apple',
    description: 'lorem ipsum dolor sit amet consectetur',
    color: 'black',
    price: 768,
    imageFileName: 'iPhone_7.png',
    screen: '4.7 inch IPS',
    processor: 'A10 Fusion',
    ram: 2
  },
  {
    name: 'Xiaomi Redmi Note 10',
    manufacturer: 'Xiaomi',
    description:
      'Xiaomi wants to continue its successful Note range, and with this Redmi Note 10 it gets a product as complete as its predecessor was: the Redmi Note 9. On this occasion, it has decided to incorporate a high-quality Super Amoled screen that gives this mobile a feature that until now was not present in this Xiaomi range. Its processor without being a top of the range, does not fall short for most of our tasks, if you are not a person who requires exceptional processing capacity this mobile will cover your needs 100%. Its 4 cameras are solvent in most situations achieving decent results considering the price of the mobile. In addition, a high capacity battery and fast charge make this mobile our perfect ally for day to day without having to worry about its autonomy. In short, a very complete mobile, and surely one of the best options in terms of value for money at the moment.',
    color: 'black',
    price: 159,
    imageFileName: 'xiaomi_RM10.png',
    screen: '6.43 inch FHD+',
    processor: 'Qualcomm Snapdragon 678',
    ram: 4
  }
]

const getAllContentFromPhones = async () => {
  const response = await api.get('/phones')
  return {
    response,
    names: response.body.map((phone) => phone.name)
  }
}

module.exports = { api, initialPhones, getAllContentFromPhones }
