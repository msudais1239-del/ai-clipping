FROM node:20-bullseye-slim

# Install ffmpeg and ca-certificates
RUN apt-get update \
  && apt-get install -y ffmpeg ca-certificates --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# copy package.json and install dependencies
COPY backend/package.json ./
RUN npm install --production

# copy backend source
COPY backend ./

# Ensure uploads and jobs directories exist
RUN mkdir -p uploads jobs outputs

EXPOSE 8080

# Run the TypeScript source using ts-node via npx (ts-node is in devDependencies in scaffold; npx will install it if needed)
CMD ["npx", "ts-node", "src/server.ts"]
