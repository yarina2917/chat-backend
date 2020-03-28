const uuid = require('uuid')
const pick = require('lodash/pick')
const createError = require('http-errors')

const User = require('../../models/user')

function createUser (userData) {
  return new Promise((resolve, reject) => {
    const user = new User(userData)
    user.save()
      .then(data => resolve(pick(data, ['_id', 'apiKey', 'username'])))
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
      .populate('avatar.dataId')
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
  updateUser
}
