FROM node:16

# Create app directory.
WORKDIR /client_device

ENV CLIENT_DEVICE=client_device.js

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+).
COPY package*.json .
RUN npm install

# If you are building your code for production
# RUN npm ci --only=production

COPY client_device.js .


EXPOSE 3000

CMD [ "node", "client_device.js" ]
