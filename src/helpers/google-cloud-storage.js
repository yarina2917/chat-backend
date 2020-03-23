const { format } = require('util')
const path = require('path')
const { Storage } = require('@google-cloud/storage')

const GOOGLE_CLOUD_KEYFILE = path.resolve(__dirname, '../../gh-chat-b5d531aa4d85.json')

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || 'gh-chat',
  keyFilename: GOOGLE_CLOUD_KEYFILE
})

const bucket = storage.bucket('gh-chat')
storage.getBuckets(x => console.log('11111', x))
/**
 *
 * @param { File } object file object that will be uploaded
 * @description - This function does the following
 * - It uploads a file to the image bucket on Google Cloud
 * - It accepts an object as an argument with the
 *   "originalname" and "buffer" as keys
 */

module.exports.upload = (fileName, fileBuffer) => new Promise((resolve, reject) => {
  // const { originalname, buffer } = file
  const blob = bucket.file(fileName.replace(/ /g, '_'))
  // console.log('111111', originalname)
  // console.log('1111111111', buffer)
  const blobStream = blob.createWriteStream({
    resumable: false
  })
  console.log('2222', bucket.name, blob.name)
  blobStream.on('finish', () => {
    console.log('3333')
    const publicUrl = format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`)
    resolve(publicUrl)
  })
    .on('error', (err) => {
      console.log('44444')
      reject(err)
    })
    .end(fileBuffer)
})
