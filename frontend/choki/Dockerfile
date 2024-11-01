# Build Next.js 프로젝트
FROM node:lts-alpine AS build-stage
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Run Next.js 서버
FROM node:lts-alpine AS next-stage
WORKDIR /app
COPY --from=build-stage /app . 
EXPOSE 3000
CMD ["npm", "start"]
