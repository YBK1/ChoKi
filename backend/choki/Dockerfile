# Dockerfile
FROM openjdk:17-jdk-alpine
WORKDIR /app
ARG JAR_FILE=build/libs/choki-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar
COPY certs/http_ca.crt /src/main/resources/certs/
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
