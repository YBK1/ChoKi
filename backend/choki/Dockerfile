# Dockerfile
FROM openjdk:17-jdk-alpine
WORKDIR /app
ARG JAR_FILE=build/libs/choki-0.0.1-SNAPSHOT.jar
COPY http_ca.crt src/main/resources/certs/
COPY ${JAR_FILE} app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
