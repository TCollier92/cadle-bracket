FROM node:20

RUN npm install -g typescript

# Create app directory
WORKDIR /usr/src/app/backend
COPY ./bracket-backend/package*.json ./
RUN npm install

WORKDIR ../frontend
COPY ./bracket-frontend/package*.json ./
RUN npm install

COPY ./bracket-frontend ./
RUN npm run build

WORKDIR ../backend
COPY ./bracket-backend ./
RUN npm run build
RUN mkdir public

WORKDIR ../
RUN cp ./frontend/dist/* ./backend/public/

WORKDIR ./backend
EXPOSE 8080
CMD [ "node", "./dist/index.js" ]