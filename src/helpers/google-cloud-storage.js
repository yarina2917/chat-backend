const { format } = require('util')
const path = require('path')
const { Storage } = require('@google-cloud/storage')
const uuid = require('uuid')
const GOOGLE_CLOUD_KEYFILE = path.resolve(__dirname, '../../gh-chat-b5d531aa4d85.json')

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || 'gh-chat',
  keyFilename: GOOGLE_CLOUD_KEYFILE
})

const bucket = storage.bucket('gh-chat')
/**
 *
 * @param fileBuffer file buffer
 * @param fileExt, string
 * @description - This function does the following
 * - It uploads a file to the image bucket on Google Cloud
 */

module.exports.upload = (fileBuffer, fileExt) => new Promise((resolve, reject) => {
  const blob = bucket.file(`avatars/${uuid.v4()}.${fileExt}`)
  const blobStream = blob.createWriteStream({
    resumable: false
  })
  blobStream.on('finish', () => {
    const publicUrl = format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`)
    resolve({
      key: blob.name,
      publicUrl: publicUrl
    })
  })
    .on('error', (err) => reject(err))
    .end(fileBuffer)
})

module.exports.remove = (key) => new Promise((resolve, reject) => {
  const file = bucket.file(key)
  file.delete()
    .then(() => resolve('Deleted'))
    .catch(err => reject(err))
})
