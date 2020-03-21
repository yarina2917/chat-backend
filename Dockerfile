FROM node:12

WORKDIR /srv

COPY package.json ./
RUN npm install
COPY . .

CMD ["npm", "run", "start:node"]
