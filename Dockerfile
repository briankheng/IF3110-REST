# Use the official Node.js 16-alpine image as the base image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Use npm ci to install project dependencies
RUN npm ci

# Copy tsconfig.json to the container
COPY tsconfig.json ./

# Copy the entire project to the container
COPY . .

# Generate prisma
RUN npx prisma generate

# Expose to run on port 8080
EXPOSE 8080

# Set the command to start the app
CMD [ "npm", "run", "dev" ]