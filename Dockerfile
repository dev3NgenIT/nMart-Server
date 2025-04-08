FROM node:lts-alpine
WORKDIR /app
COPY package.json yarn.lock  ./
RUN yarn install
COPY . .
EXPOSE 5000
ENTRYPOINT [ "yarn" ]
CMD [ "dev" ]
