FROM node:18 as build

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

# FROM nginx:stable-alpine

# RUN rm -rf /etc/nginx/conf.d
# COPY conf /etc/nginx

# COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["node", "server.js"]