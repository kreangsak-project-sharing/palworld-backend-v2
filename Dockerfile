# Use an official Node.js runtime as the base image
FROM node:lts-alpine

# Set the working directory in the container
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml to the container
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Build on windows
# RUN npm run build 

RUN pnpx prisma generate

# Expose the port the app runs on
EXPOSE 5001

# Set NODE_ENV to production
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/index.js"]