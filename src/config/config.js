const config = {
  port: 3000,
  dbUrl: process.env.DB_URL || 'mongodb://localhost/chat',
  secretKey: 'GnsKWV78X88BZQkvqzL2WRu333j10qDI'
}

module.exports = config
