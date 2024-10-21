# Set the Node.js version
ARG NODE_VERSION=20.18.0

# Use the Node.js Alpine image
FROM node:$NODE_VERSION-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Now copy the rest of the application code
COPY . .

# Expose the desired port
EXPOSE 8080

# Command to run the application
CMD ["npm", "run", "start"]
