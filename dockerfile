FROM node:20

RUN npm install -g typescript

# Create app directory
WORKDIR /usr/src/app

COPY ./bracket-backend/package*.json ./
RUN npm install

COPY ./bracket-backend ./
RUN npm run build

EXPOSE 8081
CMD [ "node", "dist/index.js" ]