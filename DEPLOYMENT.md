# 🚀 Deployment Guide

## Vercel Deployment (Recommended)

### Prerequisites
- Vercel account (sign up at https://vercel.com)
- Git repository (GitHub, GitLab, or Bitbucket)
- Vercel CLI installed: `npm install -g vercel`

### Step-by-Step Deployment

#### 1. Prepare Your Repository

```bash
cd /home/claudebot/clawd/projects/dasbot-mission-control

# Initialize git if not already done
git init
git add .
git commit -m "Initial commit: Mission Control Dashboard"

# Push to your remote repository
git remote add origin <your-repo-url>
git push -u origin main
```

#### 2. Configure Data Source

Since Vercel can't access `/home/claudebot/clawd/mission-control.json`, choose one of these options:

##### Option A: Environment Variable (Simplest)

1. Copy your JSON content:
```bash
cat /home/claudebot/clawd/mission-control.json | pbcopy
```

2. In Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add `MISSION_CONTROL_DATA` with your JSON content

3. Update `app/api/tasks/route.ts`:
```typescript
export async function GET() {
  try {
    const data = process.env.MISSION_CONTROL_DATA;
    if (data) {
      return NextResponse.json(JSON.parse(data));
    }
    
    // Fallback to file system
    const filePath = path.join("/home/claudebot/clawd", "mission-control.json");
    const fileContent = await readFile(filePath, "utf-8");
    return NextResponse.json(JSON.parse(fileContent));
  } catch (error) {
    return NextResponse.json({
      tasks: [],
      lastUpdated: new Date().toISOString(),
    });
  }
}
```

##### Option B: API Webhook

1. Create a simple Express server or use Clawdbot Gateway API
2. Expose `/api/mission-control` endpoint
3. Update fetch URLs to point to your API

##### Option C: Include in Repository

```bash
# Copy to public directory
cp /home/claudebot/clawd/mission-control.json public/

# Update app/api/tasks/route.ts
const filePath = path.join(process.cwd(), "public", "mission-control.json");
```

⚠️ **Warning**: This makes your data public. Only use for non-sensitive tasks.

#### 3. Deploy to Vercel

**Via CLI:**
```bash
cd /home/claudebot/clawd/projects/dasbot-mission-control

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

**Via GitHub:**
1. Push code to GitHub
2. Go to https://vercel.com/new
3. Import your repository
4. Configure environment variables
5. Deploy!

#### 4. Configure Custom Domain (Optional)

```bash
# Add custom domain
vercel domains add mission-control.yourdomain.com

# Vercel will provide DNS records to configure
```

### Post-Deployment

1. **Verify deployment**:
   - Check that tasks load correctly
   - Test auto-refresh (wait 30s)
   - Open card details
   - Test on mobile

2. **Set up monitoring**:
   - Enable Vercel Analytics
   - Set up error tracking (Sentry, LogRocket, etc.)

3. **Performance**:
   - Run Lighthouse audit
   - Check Core Web Vitals in Vercel dashboard

## Alternative Deployments

### Docker

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Build image
docker build -t mission-control .

# Run container
docker run -p 3000:3000 \
  -v /home/claudebot/clawd/mission-control.json:/app/data/mission-control.json \
  mission-control
```

### Netlify

1. Push to Git repository
2. Connect to Netlify
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Add environment variables
5. Deploy!

### Self-Hosted (PM2)

```bash
cd /home/claudebot/clawd/projects/dasbot-mission-control

# Install PM2
npm install -g pm2

# Build
npm run build

# Start with PM2
pm2 start npm --name "mission-control" -- start

# Enable startup on boot
pm2 startup
pm2 save
```

## Updating the Deployment

### Auto-Deploy on Push (Vercel + GitHub)

Vercel automatically deploys on every push to `main`. No action needed!

### Manual Update

```bash
# Make changes
# ...

# Commit
git add .
git commit -m "Update tasks"

# Push (triggers Vercel deployment)
git push

# Or manual deploy
vercel --prod
```

### Update Environment Variables

```bash
# Using Vercel CLI
vercel env pull  # Download current env
vercel env add MISSION_CONTROL_DATA  # Add/update
vercel --prod  # Redeploy
```

## Troubleshooting

**Build fails on Vercel:**
- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Test build locally: `npm run build`

**Data not loading:**
- Check environment variables are set
- Verify API route is accessible: `/api/tasks`
- Check browser console for errors

**Performance issues:**
- Enable Next.js Image Optimization
- Use Vercel Edge Functions
- Implement caching headers

## Security Checklist

- [ ] Remove sensitive data from `mission-control.json`
- [ ] Set up CORS if using external API
- [ ] Enable Vercel Authentication if needed
- [ ] Use environment variables for secrets
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Set up rate limiting

## Monitoring

### Vercel Analytics

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Error Tracking

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

---

**Need help?** Check Vercel docs: https://vercel.com/docs
