FROM node:22

# Set working directory to /app
WORKDIR /app

# Copy package*.json
COPY package*.json ./

# Install any needed packages
RUN npm install

# Copy the rest of the application code
COPY . /app/

# Expose port 4200 for the web server
EXPOSE 4200

# Run the command to start the development server
CMD ["npm", "start", "--", "--host", "0.0.0.0"]
