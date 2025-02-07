# 1️⃣ Node.js 기반으로 빌드만 수행
FROM node:18 as build

# 작업 디렉토리 설정
WORKDIR /frontend

# package.json 및 package-lock.json 복사
COPY package*.json ./

# npm 패키지 설치
RUN npm install

# 프로젝트 코드 복사
COPY . .

# React 프로젝트 빌드
RUN npm run build

# assets 폴더를 별도로 복사하여 나중에 호스트에서 쉽게 접근할 수 있도록 함
RUN mkdir -p /build_assets && cp -r src/assets/* /build_assets/

# 빌드 결과물을 /output으로 모아서 Jenkins가 복사할 수 있도록 함
RUN mkdir -p /output && cp -r dist/* /output/

# 디버깅용 메시지 출력 (실제 컨테이너 실행 없이 Jenkins 빌드에서만 사용)
CMD ["echo", "React build complete and assets copied to /build_assets and /output"]
