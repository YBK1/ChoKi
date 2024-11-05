# Dockerfile
FROM openjdk:17-jdk-alpine

WORKDIR /app

ARG JAR_FILE=build/libs/choki-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar

# Elasticsearch 인증서 복사 및 신뢰 저장소에 추가
COPY http_ca.crt /etc/ssl/certs/http_ca.crt

# 인증서를 신뢰 저장소에 추가
RUN keytool -import -alias elasticsearch-ca -keystore /usr/local/openjdk-17/lib/security/cacerts -file /etc/ssl/certs/http_ca.crt -storepass changeit -noprompt

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
