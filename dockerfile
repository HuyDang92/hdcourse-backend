# Use the official Node.js image as a base image
FROM node:18.0.2

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port your Express.js app is listening on (change this if needed)
EXPOSE 8000

# Command to run your application
CMD ["npm", "start"]