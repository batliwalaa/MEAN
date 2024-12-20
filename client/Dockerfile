FROM node:14.4.0 as build

WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY . /app/
RUN npm run build:prod


# FROM node:14.4.0

# WORKDIR /app
# COPY --from=build /app/package.json /app
# COPY --from=build /app/dist /app/dist
# EXPOSE 5200

# CMD ["npm", "run", "serve:ssr"]

FROM nginx:1.17.4-alpine

COPY --from=build /app/dist/ui/browser /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx/configs/default.conf /etc/nginx/conf.d/default.conf
COPY ./ssl /etc/nginx/ssl

CMD exec nginx -g 'daemon off;'
