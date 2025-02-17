FROM node:18 as build
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build