# 1. 애플리케이션 환경
- JVM : OpenJDK 17
- 웹서버 : Nginx 1.18.0
- WAS : Tomcat 10.1.34
- IDE 버전
    - IntelliJ IDEA 2024
    - VS Code v1.97

# 2. 빌드, 베포 환경 변수
## Nginx
### nginx.conf
``` conf
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
	worker_connections 768;
}

http {

	sendfile on;
	tcp_nopush on;
	tcp_nodelay on;
	keepalive_timeout 65;
	types_hash_max_size 2048;

	server_names_hash_bucket_size 64;

	include /etc/nginx/mime.types;
	default_type application/octet-stream;

	ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3; 
	ssl_prefer_server_ciphers on;


	access_log /var/log/nginx/access.log;
	error_log /var/log/nginx/error.log;

	gzip on;

	gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

	include /etc/nginx/conf.d/*.conf;
	include /etc/nginx/sites-enabled/*;
}

```
### /etc/nginx/sites-available/starbooks.site
``` conf
server {
	listen 10080;
	listen [::]:10080;
	server_name 13.124.233.150;

        location / {
        	return 301 https://starbooks.site$request_uri;
        }
}

server {
   	listen 443 ssl;
	listen [::]:443 ssl;

	server_name starbooks.site 13.124.233.150;
        ssl_certificate /etc/letsencrypt/live/starbooks.site/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/starbooks.site/privkey.pem;

        include /etc/letsencrypt/options-ssl-nginx.conf;
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
	ssl_ciphers HIGH:!aNULL:!MD5;

	location / {
		proxy_pass http://127.0.0.1:3002/;
		proxy_http_version 1.1;
                # 프록시 설정
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto https;
                proxy_set_header X-Forwarded-Host $host;
	}

        # ✅ Jenkins 설정 (/jenkins/)
        location /jenkins/ {
                proxy_pass http://127.0.0.1:8081/jenkins/;
		proxy_http_version 1.1;
                # 프록시 설정
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto https;
                proxy_set_header X-Forwarded-Host $host;
                proxy_set_header X-Forwarded-Prefix /jenkins;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "Upgrade";
		proxy_redirect http://jenkins:8081/jenkins/ https://$host/jenkins;
        }

        # ✅ Spring Boot API (Backend) - 포트 9097
        location /api/ {
                proxy_pass http://127.0.0.1:9097;

		# ✅ 프록시 헤더 설정
        	proxy_set_header Host $host;
	       	proxy_set_header X-Real-IP $remote_addr;
        	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        	proxy_set_header X-Forwarded-Proto https;
        	proxy_set_header Authorization $http_authorization;
        }

	location /oauth2/authorization/ {
                proxy_pass http://127.0.0.1:9097;
		proxy_http_version 1.1;
          	proxy_set_header Upgrade $http_upgrade;
	        proxy_set_header Connection "upgrade";
	       	proxy_set_header Host $host;
   	    	proxy_set_header X-Real-IP $remote_addr;
            	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            	proxy_set_header X-Forwarded-Proto $scheme;
        }
	
	location /login/oauth2/code/ {
		proxy_pass http://127.0.0.1:9097;
		proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
	}

}
```
## Back-End
### build.gradle
``` gradle
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.4.1'
    id 'io.spring.dependency-management' version '1.1.7'
    id 'java-library'
    id 'maven-publish'
}

group = 'com.starbooks.backend'
version = '0.0.1-SNAPSHOT'

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(17)
    }
}

repositories {
    mavenLocal()
    mavenCentral()
    maven {
        url = uri('https://repo.maven.apache.org/maven2/')
    }
}

configurations {
    compileOnly {
        extendsFrom annotationProcessor
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-oauth2-authorization-server'
    implementation 'org.springframework.boot:spring-boot-starter-oauth2-resource-server'
    // --------------------
    // Spring Boot Starters
    // --------------------
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-security'
    implementation 'org.springframework.boot:spring-boot-starter-websocket'
    developmentOnly 'org.springframework.boot:spring-boot-devtools'
    implementation 'org.springframework.boot:spring-boot-starter-data-redis'
    implementation 'org.springframework.boot:spring-boot-starter-oauth2-client'
    implementation 'org.springframework.boot:spring-boot-starter-mail'
    implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.3.0"'

    //웹소켓
    implementation 'org.springframework.boot:spring-boot-starter-websocket'
    implementation 'com.neovisionaries:nv-websocket-client:2.14'
    implementation 'com.fasterxml.jackson.core:jackson-databind'
    implementation 'io.livekit:livekit-server:0.8.3'
    implementation 'org.springframework:spring-messaging'

    // AWS
    implementation 'com.amazonaws:aws-java-sdk-s3:1.12.261'
    implementation 'org.springframework.cloud:spring-cloud-starter-aws:2.2.6.RELEASE'

    // ------------
    // JJWT (0.11+)
    // ------------
    // parserBuilder() 메서드는 0.11.0 이상에서 지원되므로, 0.12.3 버전 사용
    implementation 'io.jsonwebtoken:jjwt-api:0.12.3'
    runtimeOnly 'io.jsonwebtoken:jjwt-impl:0.12.3'
    runtimeOnly 'io.jsonwebtoken:jjwt-jackson:0.12.3'

    // Lombok
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'
    testCompileOnly 'org.projectlombok:lombok'
    testAnnotationProcessor 'org.projectlombok:lombok'

    // Validation (Bean Validation 등을 사용할 경우)
    implementation 'org.springframework.boot:spring-boot-starter-validation'

    // DB
    runtimeOnly 'com.mysql:mysql-connector-j:8.0.33'

    // QueryDSL
    implementation 'com.querydsl:querydsl-jpa:5.0.0:jakarta'
    annotationProcessor 'com.querydsl:querydsl-apt:5.0.0:jakarta'
    annotationProcessor 'jakarta.annotation:jakarta.annotation-api'
    annotationProcessor 'jakarta.persistence:jakarta.persistence-api'
    implementation('com.jakewharton.retrofit:retrofit2-kotlinx-serialization-converter:0.8.0') {
        exclude group: 'org.jetbrains.kotlinx', module: 'kotlinx-serialization-json'
    }

    // SMS 예시 (nurigo)
    implementation 'net.nurigo:sdk:4.3.0'

    // Test
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testImplementation 'com.h2database:h2'
    testImplementation 'org.springframework.security:spring-security-test'
    testRuntimeOnly 'org.junit.platform:junit-platform-launcher'
    implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.5.0'
    testImplementation 'org.mockito:mockito-core:3.6.28'
    testImplementation 'org.mockito:mockito-junit-jupiter:3.6.28'

}

tasks.named('test') {
    useJUnitPlatform()
}

def generated = 'src/main/generated'

// QueryDSL QClass 파일 생성 위치 설정
tasks.withType(JavaCompile) {
    options.getGeneratedSourceOutputDirectory().set(file(generated))
}

// java source set 에 querydsl QClass 위치 추가
sourceSets {
    main.java.srcDirs += [ generated ]
}

// gradle clean 시 QClass 디렉토리 삭제
clean {
    delete file(generated)
}

```
### application.yml
``` yml
spring:
  profiles:
    active: prod
#    active: dev
```
### application-prod.yml
``` yml
server:
  port: 9097
#  forward-headers-strategy: framework

livekit:
  api:
    key: ${LIVEKIT_REMOVED}
    secret: ${LIVEKIT_API_SECRET}

spring:

  jackson:
    deserialization:
      accept-single-value-as-array: true
      accept-empty-string-as-null-object: true
    serialization:
      write-dates-as-timestamps: true
    default-property-inclusion: non_null
    time-zone: Asia/Seoul

  mail:
    host: smtp.gmail.com
    port: 587
    username: ehdgus9370@gmail.com           # 본인의 구글 이메일로 변경
    password: ${SMTP_PASSWORD}      # 앱 비밀번호로 변경
    properties:
      mail.smtp.auth: true
      mail.smtp.starttls.enable: true

  config:
    activate:
      on-profile: prod
  datasource:
    url: ${DB_URL}
    username: ${DB_USER}
    password: ${DB_PASSWORD}
    driver-class-name: com.mysql.cj.jdbc.Driver

    hikari:
      maximum-pool-size: 10
      minimum-idle: 2
      idle-timeout: 30000
      max-lifetime: 1800000
      connection-init-sql: SET time_zone = 'Asia/Seoul'


  jpa:
    open-in-view: true
    hibernate:
      ddl-auto: update
      naming:
        physical-strategy: org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl
    show-sql: false
    properties:
      hibernate.format_sql: true
      dialect: org.hibernate.dialect.MySQL8InnoDBDialect
      hibernate.id.new_generator_mappings: false

  security:
    oauth2:
      client:
        registration:
          google:
            client-id: ${GOOGLE_CLIENT_ID}
            client-secret: ${GOOGLE_CLIENT_SECRET}
            scope:
              - openid
              - profile
              - email
            redirect-uri: "https://starbooks.site/login/oauth2/code/google"
            authorization-grant-type: authorization_code
          naver:
            client-id: ${NAVER_CLIENT_ID}
            client-secret: ${NAVER_CLIENT_SECRET}
            scope:
              - name
              - email
            redirect-uri: "https://starbooks.site/login/oauth2/code/naver"
            authorization-grant-type: authorization_code
        provider:
          naver:
            authorization-uri: https://nid.naver.com/oauth2.0/authorize
            token-uri: https://nid.naver.com/oauth2.0/token
            user-info-uri: https://openapi.naver.com/v1/nid/me
            user-name-attribute: response


  data:
    redis:
      host: localhost
      port: 6379
      password: ${REDIS_PASSWORD}

openai:
  api:
    key: ${OPENAI_REMOVED}

jwt:
  secret: ${JWT_SECRET_KEY}
  accessToken-expiration: 3600000
  refreshToken-expiration: 1209600000
  oauth-sign-up-expiration: 600000

cloud:
  aws:
    credentials:
      accessKey: ${AWS_CLOUD_ACCESS_KEY}
      secretKey: ${AWS_CLOUD_SECRET_KEY}
    s3:
      bucket: starbooks
    region:
      static: ap-northeast-2

anthropic:
  api:
    key: ${ANTHROPIC_REMOVED}

logging:
  level:
    org.hibernate.SQL: off

file:
  upload-dir: uploads/

```
## Front-End
### package.json
``` json

```
### constants.jsx
``` jsx
export const API_URL = "http://localhost:9090/api";
export const CONTENT_TYPE_JSON = "application/json";
```
### .env
```
VITE_API_BASE_URL=https://starbooks.site
```
# 3. 베포시 특이사항
1. SpringBoot 프로젝트의 src/main/resources 폴더 아래 `application.yml` 과 `application-prod.yml` 두 파일이 포함되어야 한다.
2. React 프로젝트의 최상단 폴더(`frontend` 폴더)에 `.env` 파일이 포함되어야 한다.
3. `sudo ln -s /etc/nginx/sites-available/starbooks.site /etc/nginx/sites-enabled/` 명령어를 사용하여 심볼릭 링크 형태로 연결해야합니다.

# 4. DB, Jenkins 계졍 정보
### MySQL
- HOST : i12d206.p.ssafy.io
- PORT : 3306
- Database : starbooks
- ID : root
- Password : admin12root34manager!?
### Jenkins
- ID : admin
- Password : Rnjs3121502!!