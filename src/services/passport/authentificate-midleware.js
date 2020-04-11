const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const CustomStrategy = require('passport-custom')
const createError = require('http-errors')

const User = require('../../models/user')
const { decrypt } = require('../../services/utils/utils')

passport.use('api-key',
  new CustomStrategy((req, done) => {
    User.findOne({ apiKey: req.headers['x-api-key'] })
      .then(user => done(null, user))
      .catch(done)
  })
)

passport.use('local', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, (username, password, done) => {
  User.findOne({ username: username })
    .then((user) => {
      if (!user || decrypt(user.password) !== decrypt(password)) {
        return done(createError(401, 'Incorrect login data'))
      }
      return done(null, user)
    })
    .catch(done)
}))

module.exports.apiKey = passport.authenticate(['api-key'], { session: false })
module.exports.local = passport.authenticate(['local'], { session: false })
