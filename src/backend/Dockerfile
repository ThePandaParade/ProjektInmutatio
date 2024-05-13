FROM node:21 as base

WORKDIR /app

COPY package*.json .

RUN npm i

COPY . .
RUN npm run build