const deviceSchema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'DeviceSchema',
    type: 'object',
    properties: {
      deviceName: {
        type: 'string',
        maxLength: 150.
       },
        deviceID: {
          type: 'string',
          maxLength: 32
      },
      owners: [
        {
          userID: 'string',
          maxLength: 150.
        }
      ]
    },
    required: ['deviceName', 'deviceID']
  }
export {deviceSchema};