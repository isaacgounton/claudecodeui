# Docker Deployment Guide

## Quick Start

1. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` and add your Anthropic API key:**
   ```bash
   ANTHROPIC_API_KEY=your_actual_api_key_here
   ```

3. **Start the application:**
   ```bash
   docker-compose up -d
   ```

4. **Access the application:**
   - Open http://localhost:3001 in your browser

## Adding Projects

To import projects into the Docker container, you have several options:

### Option 1: Use mounted directories
Projects in these host directories will automatically be available:
- `~/projects/` → `/home/projects/` (in container)
- Current directory → `/workspace/` (in container)

### Option 2: Copy projects into the container
```bash
# Copy a project directory to the mounted projects folder
cp -r /path/to/your/project ./projects/

# Or create a new project in the projects folder
mkdir ./projects/my-new-project
cd ./projects/my-new-project
# Initialize your project here
```

### Option 3: Modify docker-compose.yml volume mounts
Edit `docker-compose.yml` to add your specific project directories:
```yaml
volumes:
  - /path/to/your/projects:/workspace/projects
  - /another/project/path:/workspace/another-project
```

## Configuration Files

The container will automatically use your host Claude CLI configuration if available:
- `~/.claude/` → `/root/.claude/` (read-only)
- `~/.cursor/` → `/root/.cursor/` (read-only)

## Troubleshooting

### No projects showing up
1. Ensure your projects are in the mounted directories
2. Check volume mounts in docker-compose.yml
3. Restart the container: `docker-compose restart`

### Claude CLI not working
1. Verify your ANTHROPIC_API_KEY is set in .env
2. Check container logs: `docker-compose logs claude-code-ui`
3. Ensure Claude CLI is authenticated in the host system

### Permission issues
If you encounter permission issues with mounted volumes, try:
```bash
# Fix ownership of project files
sudo chown -R $USER:$USER ./projects/
```

## Development

To rebuild after making changes:
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```