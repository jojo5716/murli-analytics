FROM node:12-alpine

# Install dependencies
COPY package.json package-lock.json /app/
WORKDIR /app
RUN npm ci --production

# Copy app
COPY . /app

# Default run command
EXPOSE 3000
CMD [ "node", "src/app" ]
