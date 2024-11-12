# Python 3.10 베이스 이미지 사용
FROM python:3.10-slim

# 작업 디렉토리를 설정합니다.
WORKDIR /app

# 필요한 시스템 패키지 설치
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc git && \
    rm -rf /var/lib/apt/lists/*

# requirements.txt 파일을 컨테이너로 복사
COPY requirements.txt .

# 의존성 설치
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 파일을 컨테이너로 복사
COPY . .

# gunicorn을 사용해 애플리케이션을 실행
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
