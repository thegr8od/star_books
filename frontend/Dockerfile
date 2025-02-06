# React 애플리케이션을 위한 Dockerfile입니다.

# 빌드 단계
FROM node:18 AS build
WORKDIR /app
RUN ls /app
COPY package*.json ./
RUN npm install
COPY . .
RUN ls /app
RUN npm run build

# 배포 단계
FROM nginx:1.18
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]