FROM node:16

# Create app directory.
WORKDIR /websocket_server

ENV WEBSOCKET_SERVER = websocket_server.js

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+).

# Copy files to container.
COPY package*.json .
RUN npm install

COPY websocket_server.js .

# If you are building your code for production
# RUN npm ci --only=production

EXPOSE 3000

CMD node websocket_server.js
