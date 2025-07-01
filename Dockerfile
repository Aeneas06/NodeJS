FROM node:20

WORKDIR /usr/src/App

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8000

CMD [ "node", "app.js" ]
