FROM node:12.20.0-alpine3.12
COPY /src /tmp/src
COPY /public /tmp/public
COPY package-lock.json /tmp/package-lock.json
COPY package.json /tmp/package.json
COPY yarn.lock /tmp/yarn.lock
WORKDIR /tmp
RUN npm install
ENTRYPOINT npm start