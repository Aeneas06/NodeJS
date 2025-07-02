# Use official Node.js LTS image
FROM node:20

# Set the working directory
WORKDIR /usr/src/App

# Copy only dependency definitions first
COPY package.json ./
COPY package-lock.json ./  

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the app port
EXPOSE 8000

# Start the app
CMD ["node", "app.js"]
