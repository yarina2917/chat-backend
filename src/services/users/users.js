const uuid = require('uuid')
const pick = require('lodash/pick')
const createError = require('http-errors')
const { upload, remove } = require('../../helpers/google-cloud-storage')
const FileType = require('file-type')

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

function updateUserAvatar (id, imageBuffer, originalName) {
  return new Promise((resolve, reject) => {
    User.findById(id)
      .populate('avatar')
      .then(async user => {
        if (user.avatar && user.avatar.key) {
          await remove(user.avatar.key)
        }
        user.avatar = null
        return user
      })
      .then(user => {
        let fileExt = ''
        return FileType.fromBuffer(imageBuffer)
          .then(fileDetails => {
            if (!fileDetails) {
              reject(createError(400, 'Wrong request. Request should contain a file.'))
            }
            fileExt = fileDetails.ext
            return upload(imageBuffer, fileExt)
              .then(data => data)
              .catch(error => reject(createError(error.status || 400, error.message)))
          })
          .then(file => {
            const newFile = new File({
              key: file.key,
              url: file.publicUrl,
              ext: fileExt,
              originalName: originalName
            })
            newFile.save()
            user.avatar = newFile.id
            user.save()
            return newFile
          })
      })
      .then(resolve)
      .catch(reject)
  })
}

function deleteAvatar (id) {
  return new Promise((resolve, reject) => {
    User.findById(id)
      .populate('avatar')
      .then(user => {
        remove(user.avatar.key)
        return user
      })
      .then(user => {
        return File.findOneAndRemove({ _id: user.avatar._id })
          .then(() => {
            user.avatar = null
            user.save()
            return user
          })
          .catch(err => reject(err))
      })
      .then(resolve)
      .catch(reject)
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
      .populate('avatar')
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
  updateUserAvatar,
  deleteAvatar
}
