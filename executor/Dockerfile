FROM node:13.12.0-alpine

RUN npm install -g nodemon

RUN mkdir -p /home/app
WORKDIR /home/app

COPY package.json /home/app
RUN npm install

EXPOSE 5700

CMD ["nodemon", "-L", "index.js"]