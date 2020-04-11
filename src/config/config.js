const config = {
  port: process.env.PORT || 3000,
  dbUrl: `${process.env.MONGO_SRV}${process.env.MONGO_USER}:${process.env.NEW_MONGO_PASSWORD}@${process.env.MONGO_HOST}/test?retryWrites=true&w=majority`,
  secretKey: 'GnsKWV78X88BZQkvqzL2WRu333j10qDI'
}

module.exports = config
