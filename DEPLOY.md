# Deployment Instructions for Mission Control Dashboard

## Option 1: Deploy via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/new
2. Import the GitHub repository: `dschwartzAI/dasbot-mission-control`
3. Configure environment variables:
   - `GATEWAY_URL` = `https://obvious-columns-recent-indiana.trycloudflare.com`
   - `GATEWAY_TOKEN` = `da8ead3191a0704ea29cc2727d617e4c67e50426f99043aa`
4. Click "Deploy"

## Option 2: Deploy via Vercel CLI

1. Get a Vercel token from: https://vercel.com/account/tokens
2. Set the token: `export VERCEL_TOKEN=your_token_here`
3. Deploy:
```bash
cd /home/claudebot/clawd/projects/dasbot-mission-control
vercel --prod --token $VERCEL_TOKEN \
  -e GATEWAY_URL=https://obvious-columns-recent-indiana.trycloudflare.com \
  -e GATEWAY_TOKEN=da8ead3191a0704ea29cc2727d617e4c67e50426f99043aa
```

## Environment Variables

- **GATEWAY_URL**: The Cloudflare tunnel URL for the Gateway
- **GATEWAY_TOKEN**: Authentication token for Gateway API access

## Post-Deployment

After deployment, the dashboard will be accessible at your Vercel URL (e.g., `https://dasbot-mission-control.vercel.app`).

## API Integration Status

The dashboard is configured to fetch:
- **In-Progress Tasks**: From Gateway sessions API (`/api/sessions`)
- **Scheduled Tasks**: From Gateway cron API (`/api/cron`)

Currently showing fallback data because Gateway API endpoints need to be verified/configured.
