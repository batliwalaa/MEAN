FROM node:14.4.0 as build

WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/

RUN npm run build
EXPOSE 3000
CMD ["node", "dist/server.js"]

