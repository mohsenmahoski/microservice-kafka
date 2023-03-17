FROM node:16.4.2
WORKDIR /app
COPY package.json ./
RUN npm install
COPY ./ ./
RUN npm run build
CMD ["npm","run","start:prod"]