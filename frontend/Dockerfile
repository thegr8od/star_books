# React 애플리케이션을 위한 Dockerfile입니다.

FROM node:18 AS build
COPY package*.json ./
COPY ./src/assets/ /home/ubuntu/images
RUN npm install
COPY . .
RUN npm run build