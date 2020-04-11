const ajv = require('ajv/lib/ajv')()

function generateUserValidator (type) {
  const schema = {
    type: 'object',
    properties: {
      username: {
        type: 'string'
      },
      password: {
        type: 'string'
      }
    }
  }
  schema.required = type === 'create' ? ['username', 'password'] : ['username']
  return schema
}

module.exports.createUser = ajv.compile(generateUserValidator('create'))
module.exports.updateUser = ajv.compile(generateUserValidator('update'))
