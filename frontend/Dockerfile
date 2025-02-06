# React 애플리케이션을 위한 Dockerfile입니다.

FROM node:18 AS build
WORKDIR /app
RUN ls /app
COPY package*.json ./
RUN npm install
COPY . .
RUN ls /app
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]