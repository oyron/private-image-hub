FROM node:lts-alpine

#Build server
WORKDIR /usr/src/app
COPY package.json .
RUN npm install --production
COPY src/*.js src/

WORKDIR /usr/src/app
ARG portNumber=8080
ENV PORT=$portNumber
EXPOSE $portNumber

RUN addgroup -S -g 1001 radix-non-root-group
RUN adduser -S -u 1001 -G radix-non-root-group radix-non-root-user
USER 1001
CMD ["node", "src/server.js"]

