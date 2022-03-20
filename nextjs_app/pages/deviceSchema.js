const deviceSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "DeviceSchema",
  type: "object",
  properties: {
    sensor: {
      type: "object",
      properties: {
        sensorOutput: {
          type: "array",
          properties: {
            name: {
              type: "string",
              maxLength: 150,
            },
            value: {
              type: "number",
            },
          },
        },
        deviceName: {
          type: "string",
          maxLength: 150,
        },
      },
    },
  },
  required: ["deviceName"],
};
export { deviceSchema };
