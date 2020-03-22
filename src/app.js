const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const compression = require('compression')
const createError = require('http-errors')

const { validateError } = require('./validators/validate-error-handler')

const config = require('./config/config')
const apiV1 = require('./api-routes/api-v1')

const app = express()

require('dotenv').config()

require('./loaders/datastore')
    .connect()
    .then(() => {
        app.use(cors())
        app.use(compression())
        app.use(bodyParser.json())

        app.use('/api/v1', apiV1)

        app.use((req, res, next) => next(createError(404)))

        app.use(validateError)

        app.listen(config.port, () => {
            console.log(`Server works on port ${config.port}`)
        })
    })
    .catch(console.error)

module.exports = app
