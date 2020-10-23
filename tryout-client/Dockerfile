FROM node:11.6.0-alpine

ENV NPM_CONFIG_LOGLEVEL warn

WORKDIR /usr/src/app

COPY package.json ./

RUN npm config set unsafe-perm true

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]