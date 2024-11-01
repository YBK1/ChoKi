# 1. Build stage - Node.js로 Next.js 빌드
FROM node:lts-alpine AS build-stage
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build  # Next.js 프로젝트 빌드

# 2. Run stage - Next.js 서버 실행
FROM node:lts-alpine AS next-stage
WORKDIR /app
COPY --from=build-stage /app . 
EXPOSE 3000
CMD ["npm", "start"]

# 3. Nginx stage - 리버스 프록시 설정
FROM nginx:stable-alpine AS nginx-stage
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=next-stage /app /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
