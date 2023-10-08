FROM node:18-alpine as development
WORKDIR /app
COPY package.json ./
RUN npm i
COPY . .
RUN npm run build
