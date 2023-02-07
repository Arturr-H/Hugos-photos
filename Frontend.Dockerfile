FROM node:14

WORKDIR /usr/src/app/frontend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]
