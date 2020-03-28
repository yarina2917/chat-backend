const { upload, remove } = require('../../helpers/google-cloud-storage')
const FileType = require('file-type')
const createError = require('http-errors')

const User = require('../../models/user')
const Chat = require('../../models/chat')
const File = require('../../models/file')

function updateAvatar (id, imageBuffer, originalName, type) {
  return new Promise((resolve, reject) => {
    const model = type === 'Profile' ? User : Chat
    model.findById(id)
      .populate('avatar.dataId')
      .then(async user => {
        if (user.avatar && user.avatar.dataId && user.avatar.dataId.key) {
          await remove(user.avatar.dataId.key)
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
          .then(async file => {
            const newFile = new File({
              key: file.key,
              url: file.publicUrl,
              ext: fileExt,
              originalName: originalName
            })
            await newFile.save()
            user.avatar = {
              dataId: newFile.id,
              url: file.publicUrl
            }
            await user.save()
            return newFile
          })
      })
      .then(resolve)
      .catch(reject)
  })
}

function deleteAvatar (id, type) {
  return new Promise((resolve, reject) => {
    const model = type === 'Profile' ? User : Chat
    model.findById(id)
      .populate('avatar.dataId')
      .then(async user => {
        await remove(user.avatar.dataId.key)
        return user
      })
      .then(user => {
        return File.findOneAndRemove({ _id: user.avatar._id })
          .then(() => {
            user.avatar = null
            return user.save()
          })
          .catch(err => reject(err))
      })
      .then(resolve)
      .catch(reject)
  })
}

module.exports = {
  updateAvatar,
  deleteAvatar
}
