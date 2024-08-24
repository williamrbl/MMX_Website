# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install
RUN npm install dotenv
RUN npm install cors

# Copy the rest of the application code to the working directory
COPY . .

# Build the Quasar project for production
RUN node index.js

# Install serve globally
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["serve", "-s", ".", "-l", "3000"]
