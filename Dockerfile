FROM node:20-alpine

# Install system dependencies required for native modules and Claude CLI
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    sqlite \
    curl \
    bash \
    ca-certificates

# Install Claude CLI
RUN curl -L https://github.com/anthropics/claude-cli/releases/latest/download/claude-linux-x64 -o /usr/local/bin/claude \
    && chmod +x /usr/local/bin/claude

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy application code
COPY . .

# Build the frontend
RUN npm run build

# Remove dev dependencies to reduce image size
RUN npm prune --omit=dev

# Create data directory for SQLite database
RUN mkdir -p /app/data

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3001/health || exit 1

# Start the application (server only, build already completed)
CMD ["npm", "run", "server"]