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

# Install serve globally
RUN npm install -g serve

# Change the working directory to the build output directory
WORKDIR /app/dist/spa

# Ensure static assets are included
COPY src/assets /app/dist/spa/assets

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["serve", "-s", ".", "-l", "3000"]
