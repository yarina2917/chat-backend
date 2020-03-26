const ajv = require('ajv/lib/ajv')()

function generateChatValidator (type) {
  const schema = {
    type: 'object',
    properties: {
      chatName: {
        type: 'string'
      },
      chatType: {
        type: 'string'
      },
      description: {
        type: 'string'
      }
    }
  }

  schema.required = type === 'create' ? ['chatName', 'chatType'] : ['chatName']

  return schema
}

module.exports.createChat = ajv.compile(generateChatValidator('create'))
module.exports.updateChat = ajv.compile(generateChatValidator('update'))
