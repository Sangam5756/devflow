FROM node

WORKDIR /app/devflow

COPY  ./package.json ./

RUN npm install

COPY . .

CMD ["npm","run","dev"]