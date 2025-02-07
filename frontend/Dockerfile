# 1️⃣ Node.js 기반으로 빌드만 수행
FROM node:18 as build

# 작업 디렉토리 설정
WORKDIR /app

# package.json 및 package-lock.json 복사
COPY package*.json ./

# npm 패키지 설치
RUN npm install

# 프로젝트 코드 복사
COPY . .

# React 프로젝트 빌드
RUN npm run build

# assets 파일을 따로 복사하여 나중에 호스트에 저장 가능하도록 함
RUN mkdir -p /build_assets && cp -r /app/src/assets/* /build_assets/

# 최종 결과물을 nginx가 사용할 디렉토리로 복사 (실제로 컨테이너를 실행하지 않지만 Jenkins에서 사용할 수 있도록)
RUN cp -r /app/dist /final_build

# 2️⃣ 빌드 결과물을 사용하기 위해 컨테이너의 /final_build 폴더를 활용
CMD ["echo", "React Build Complete"]