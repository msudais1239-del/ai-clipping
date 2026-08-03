# Use official node image as base
FROM node:20-alpine

WORKDIR /app

# install dependencies
COPY backend/package.json ./
RUN npm install --production

# copy source
COPY backend ./

# build (if you add a build step)
# RUN npm run build

EXPOSE 8080
CMD ["node", "src/server.ts"]
