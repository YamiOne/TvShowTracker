FROM node:alpine

RUN mkdir /tv_show_tracker
WORKDIR /tv_show_tracker

COPY build/ /tv_show_tracker

COPY package.json /tv_show_tracker
RUN npm install --production

ENV MONGOURI=mongodb://mongo/test
ENV SEED_DB=true

EXPOSE 5000
