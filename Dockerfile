# Use the official Node.js 16-alpine image as the base image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Install esbuild in the Docker image
RUN npm install -g esbuild

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Use npm ci to install project dependencies
RUN npm ci

# Copy the entire project to the container
COPY . .

# Expose to run on port 8080
EXPOSE 8080

# Set the command to start the app
CMD ["npm", "run", "dev"]
