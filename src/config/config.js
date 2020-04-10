const DEV = true
const config = {
  port: process.env.PORT || 3000,
  dbUrl: DEV
    ? process.env.DB_LOCAL_URL || 'mongodb://localhost/chat'
    : `${process.env.DB_SRV}${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/test?retryWrites=true&w=majority`,
  secretKey: 'GnsKWV78X88BZQkvqzL2WRu333j10qDI'
}

module.exports = config
module.exports.DEV = DEV
