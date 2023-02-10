FROM node:14

WORKDIR /usr/src/app/frontend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

RUN npm run build

CMD [ "npm", "start" ]
