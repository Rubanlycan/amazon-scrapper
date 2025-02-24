# Use a Node.js base image
FROM node:22-slim

# Set the working directory
WORKDIR /

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN yarn install

# Install Playwright browsers (and their dependencies)
RUN npx playwright install --with-deps

# Copy the rest of the application code
COPY . .

# Expose the port your app listens on
EXPOSE 3000

# Start the application
CMD ["node", "amazon-scraper.js"]