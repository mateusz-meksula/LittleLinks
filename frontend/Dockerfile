FROM node:18-alpine

WORKDIR /code

COPY ./package.json /code/package.json

RUN npm install

EXPOSE 3000

CMD npm run dev