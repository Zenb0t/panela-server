#Dev steps
FROM node:18-alpine as base
WORKDIR /home/node/app
COPY package*.json ./
RUN npm i
COPY . .

#Prod steps

FROM base as production
ENV NODE_PATH=./build
RUN npm run build