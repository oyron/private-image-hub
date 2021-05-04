FROM node:15-alpine

#Build server
WORKDIR /usr/src/app
COPY package.json .
RUN npm install --production
COPY src/*.js src/

#Build client
WORKDIR /usr/src/app/src/client
COPY src/client/package.json .
RUN npm install --production
COPY src/client/src src
COPY src/client/public public
RUN yarn build

WORKDIR /usr/src/app
ARG portNumber=8080
ENV PORT=$portNumber
EXPOSE $portNumber
USER "node"
CMD ["node", "src/server.js"]

