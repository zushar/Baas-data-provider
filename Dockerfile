# Specify the base image
FROM node:21.6.0

# Set the working directory in the Docker container
WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml
COPY package.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy the rest of your app's source code
COPY . .

# Build your application using pnpm
RUN pnpm run build

# Expose port 3000 to the outside once the container has launched
EXPOSE 3000

# Define the command to run your app (adjust if your main file has a different name)
CMD ["node", "dist/main.js"]
