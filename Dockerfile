FROM node:11
RUN npm i -g npm
RUN apt-get -y update ; apt-get -y upgrade
RUN apt-get install -yq postgresql-client
WORKDIR /code
