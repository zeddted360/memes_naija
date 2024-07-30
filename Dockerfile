FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .


# Set environment variables
ENV AUTH_URL=http://localhost:3000
ENV MONGO_URL=mongodb://host.docker.internal:27017/naija_memes
ENV AUTH_SECRET=rvGdxieX2nl4CaXtilEij97vpVGSxZgTM/WjUNMNHDk=

RUN npm run build

EXPOSE 3000

CMD [ "npm","start" ]


# CMD [ "npm", "start" ]