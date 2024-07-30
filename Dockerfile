FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm","start" ]

# FROM node:20.11.1-alpine

# # Install system dependencies
# RUN apk add --no-cache make gcc g++ python3

# WORKDIR /app

# COPY package*.json ./

# # Install all dependencies, including dev dependencies
# RUN npm ci --include=dev

# COPY . .

# # Add verbose logging to build process
# RUN npm run build || (echo "Build failed" && npm run build --verbose && exit 1)

# EXPOSE 3000

# CMD [ "npm", "start" ]