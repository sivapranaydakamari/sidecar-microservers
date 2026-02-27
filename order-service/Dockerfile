FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p /var/log/app

EXPOSE 3001

CMD ["node", "server.js"]