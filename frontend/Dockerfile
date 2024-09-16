# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install
RUN npm install uuid

# Copy the rest of the application code to the working directory
COPY . .

# Build the Quasar project for production
RUN npx quasar build -m pwa

# Install serve globally
RUN npm install -g serve

ENV NODE_ENV=production

# Change the working directory to the build output directory
WORKDIR /app/dist/pwa

# Ensure static assets are included
COPY src/assets /app/dist/pwa/assets

# Expose the port the app runs on
EXPOSE 9000

# Start the app
CMD ["serve", "-s", ".", "-l", "9000"]
