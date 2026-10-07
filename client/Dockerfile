FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_ONESIGNAL_APP_ID
ARG VITE_API_URL=/api

ENV VITE_CLERK_PUBLISHABLE_KEY=${VITE_CLERK_PUBLISHABLE_KEY}
ENV VITE_ONESIGNAL_APP_ID=${VITE_ONESIGNAL_APP_ID}
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

FROM nginxinc/nginx-unprivileged:stable-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
