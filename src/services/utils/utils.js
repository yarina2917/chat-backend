const CryptoJS = require('crypto-js')
const config = require('../../config/config')

function encrypt (value) {
    return CryptoJS.AES.encrypt(value, config.secretKey).toString()
}

function decrypt (textToDecrypt) {
    return CryptoJS.AES.decrypt(textToDecrypt, config.secretKey).toString(CryptoJS.enc.Utf8)
}

module.exports.encrypt = encrypt
module.exports.decrypt = decrypt
