FROM node

WORKDIR /app/devflow

COPY . .

RUN npm install

CMD ["npm","run","dev"]