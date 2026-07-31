FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ARG VITE_N8N_MENU_ANALYZE_URL=/api/menu/analyze
ARG VITE_N8N_MENU_DETAIL_URL=/api/menu/detail
ARG VITE_N8N_MENU_CHAT_URL=/api/menu/chat

ENV VITE_N8N_MENU_ANALYZE_URL=${VITE_N8N_MENU_ANALYZE_URL}
ENV VITE_N8N_MENU_DETAIL_URL=${VITE_N8N_MENU_DETAIL_URL}
ENV VITE_N8N_MENU_CHAT_URL=${VITE_N8N_MENU_CHAT_URL}

RUN npm run build

FROM nginx:1.27-alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]