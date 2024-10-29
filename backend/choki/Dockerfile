# 기본 이미지 설정
FROM openjdk:17-jdk-alpine

# 작업 디렉토리 설정
WORKDIR /app

# JAR 파일을 컨테이너로 복사
ARG JAR_FILE=app.jar
COPY ${JAR_FILE} app.jar

# 애플리케이션 포트 설정
EXPOSE 8080

# 애플리케이션 실행 명령어
ENTRYPOINT ["java", "-jar", "app.jar"]
 