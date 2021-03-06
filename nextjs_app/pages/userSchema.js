const userSchema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'UserSchema',
    type: 'object',
    properties: {
      name: {
        type: 'string',
        maxLength: 150.
      },
      userID: {
        type: 'string',
        maxLength: 32.
      },
      ownedDevices: [
          {
            deviceID: 'string',
            maxLength: 32.
          }
        ]
    },
    required: ['name'],
  }
export {userSchema};
