# Spring Boot 애플리케이션을 위한 Dockerfile입니다.

FROM openjdk:17
LABEL authors="Starbooks"
ARG JAR_FILE=build/libs/backend-0.0.1-SNAPSHOT.jar
ADD ${JAR_FILE} app.jar

# Spring Boot 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "/app.jar", ">", "app.log"]
