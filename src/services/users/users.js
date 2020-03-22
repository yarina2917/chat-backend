const uuid = require('uuid')
const pick = require('lodash/pick')
const createError = require('http-errors')
const notFound = require('../../errors/not-found')

const User = require('../../models/user')
const File = require('../../models/file')

function createUser (userData) {
  return new Promise((resolve, reject) => {
    const user = new User(userData)
    user.save()
      .then(data => resolve(pick(data, ['_id', 'apiKey'])))
      .catch(error => reject(error.message.includes('duplicate') ? createError(400, 'Username is already used') : error))
  })
}

function updateUser (id, userData) {
  return new Promise((resolve, reject) => {
    User.findOneAndUpdate({ _id: id }, userData, { new: true })
      .then(data => resolve(data))
      .catch(error => reject(error.message.includes('duplicate') ? createError(400, 'Username is already used') : error))
  })
}

function updateUserAvatar (id, image, headers) {
  return new Promise((resolve, reject) => {
    console.log('fsdfdsfdsfdsfdsfds', id)
    User.findById(id)
      .then(user => {
        // TODO add google bucket
        // const file = new File(image)
        // file.save()
        // user.avatar = file.id
        // user.save()
        resolve()
      })
      .catch(error => reject(error))
  })
}

function loginUser (userData) {
  return new Promise((resolve, reject) => {
    User
      .findOneAndUpdate({ username: userData.username }, { apiKey: uuid.v4() }, { new: true })
      .then(data => resolve(data))
      .catch(error => reject(error))
  })
}

function logoutUser (headers) {
  return new Promise((resolve, reject) => {
    User
      .findOneAndUpdate({ apiKey: headers['x-api-key'] }, { apiKey: uuid.v4() })
      .then(() => resolve({ message: 'Success' }))
      .catch(error => reject(error))
  })
}

function getUserByToken (headers) {
  return new Promise((resolve, reject) => {
    User
      .findOneAndUpdate({ apiKey: headers['x-api-key'] }, { apiKey: uuid.v4() }, { new: true })
      .then(data => resolve(data))
      .catch(error => reject(error))
  })
}

function getUser (id) {
  return new Promise((resolve, reject) => {
    User
      .findById(id)
      .then(data => resolve(data))
      .catch(error => reject(error))
  })
}

module.exports = {
  getUser,
  getUserByToken,
  createUser,
  loginUser,
  logoutUser,
  updateUser,
  updateUserAvatar
}
