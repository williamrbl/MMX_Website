# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install --force
RUN npm install dotenv --force
RUN npm install cors --force
RUN npm install exceljs --force
RUN npm install nodemailer --force
RUN npm install firebase-admin --force

# Copy the rest of the application code to the working directory
COPY . .

# Build the Quasar project for production


# Install serve globally
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD  node index.js
