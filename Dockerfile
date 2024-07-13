# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the Quasar project for production
RUN npx quasar build

RUN npm install -g serve

WORKDIR /app/dist/pwa

EXPOSE 3000

CMD ["serve","-s",".","-l","3000"]
