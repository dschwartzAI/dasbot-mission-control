#!/bin/bash
# Update mission control tasks from Gateway state

OUTPUT="/home/claudebot/clawd/projects/dasbot-mission-control/public/tasks.json"

# Get sessions and cron jobs via Clawdbot tools
# This script will be run by cron every minute

# For now, create a static structure
cat > "$OUTPUT" << 'EOJSON'
{
  "tasks": [],
  "lastUpdated": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOJSON

echo "Tasks updated at $(date)"
