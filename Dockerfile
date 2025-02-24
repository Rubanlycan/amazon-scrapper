# Use official Node.js image
FROM node:18

# Set the working directory
WORKDIR /

# Copy package.json and yarn.lock first (for better caching)
COPY package.json yarn.lock ./
RUN yarn install

# Copy the rest of the app
COPY . .

# Expose the correct port
EXPOSE 3000

# Start the server using Yarn
CMD ["yarn", "start"]
