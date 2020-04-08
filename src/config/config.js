const config = {
  DEV: false,
  port: process.env.PORT || 3000,
  dbUrl: this.DEV
    ? process.env.DB_LOCAL_URL || 'mongodb://localhost/chat'
    : `${process.env.DB_SRV}${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/test?retryWrites=true&w=majority`,
  secretKey: 'GnsKWV78X88BZQkvqzL2WRu333j10qDI'
}

module.exports = config
