FROM node:16.15.0-alpine

ENV TZ=Europe/Tallinn

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "start"]
