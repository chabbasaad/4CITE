FROM node:18

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port
EXPOSE 5173

# Start development server instead of production build
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
