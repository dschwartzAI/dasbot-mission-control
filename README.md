# 🚀 DasBot Mission Control

A beautiful, dark-themed Kanban dashboard for tracking DasBot tasks and projects. Inspired by NASA mission control aesthetics meets modern project management tools like Linear and Height.

![Mission Control Dashboard](https://img.shields.io/badge/Next.js-14+-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4+-06B6D4?logo=tailwindcss)

## ✨ Features

- 🎨 **NASA Mission Control Theme** - Dark, sleek interface with cyan accents
- 📊 **5-Column Kanban Board** - Backlog, In Progress, Waiting, Done (Today), Scheduled
- 🔄 **Real-time Updates** - Auto-polling every 30 seconds
- 📱 **Mobile Responsive** - Works beautifully on all devices
- 🎯 **Rich Task Cards** - Progress bars, timestamps, links, tags, priority levels
- 🔗 **Smart Linking** - Connect tasks to files, GitHub repos, and sub-agent sessions
- 💫 **Smooth Animations** - Polished transitions and hover effects
- 🌙 **Dark Mode Native** - Designed for dark theme from the ground up

## 🏗️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS 4
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **Data Source**: JSON file at `/home/claudebot/clawd/mission-control.json`

## 📦 Installation

```bash
# Navigate to the project
cd /home/claudebot/clawd/projects/dasbot-mission-control

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## 🚀 Deployment to Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Manual Deploy

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd /home/claudebot/clawd/projects/dasbot-mission-control
   vercel
   ```

4. **Production Deploy**
   ```bash
   vercel --prod
   ```

### Important Notes for Deployment

⚠️ **File System Access**: The app reads from `/home/claudebot/clawd/mission-control.json`. For Vercel deployment, you'll need to either:

1. **Option A - Environment Variable** (Recommended):
   - Create a Vercel environment variable `MISSION_CONTROL_JSON` with your JSON content
   - Update `app/api/tasks/route.ts` to read from the env var

2. **Option B - API Endpoint**:
   - Expose `mission-control.json` via a separate API
   - Update the fetch URLs in the app

3. **Option C - Include in Build**:
   - Copy `mission-control.json` to `public/` directory
   - Update paths to fetch from `/mission-control.json`

### Recommended Vercel Configuration

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

## 📝 Data Format

Update `/home/claudebot/clawd/mission-control.json` with your tasks:

```json
{
  "tasks": [
    {
      "id": "1",
      "title": "Task Title",
      "description": "Detailed description",
      "status": "in-progress",
      "progress": 75,
      "startedAt": "2025-01-20T00:00:00Z",
      "estimatedCompletion": "2025-01-20T12:00:00Z",
      "links": [
        {
          "label": "GitHub PR",
          "url": "https://github.com/...",
          "type": "github"
        }
      ],
      "tags": ["frontend", "urgent"],
      "priority": "high",
      "subagentSession": "agent:main:subagent:..."
    }
  ],
  "lastUpdated": "2025-01-20T00:00:00Z"
}
```

### Task Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✅ | Unique task identifier |
| `title` | string | ✅ | Task name |
| `description` | string | ✅ | Detailed description |
| `status` | enum | ✅ | `backlog`, `in-progress`, `waiting`, `done`, `scheduled` |
| `progress` | number | ❌ | 0-100 completion percentage |
| `startedAt` | ISO date | ❌ | When task started |
| `estimatedCompletion` | ISO date | ❌ | Expected completion time |
| `completedAt` | ISO date | ❌ | When task completed |
| `scheduledFor` | ISO date | ❌ | Scheduled start time |
| `links` | array | ❌ | Related links (files, GitHub, etc.) |
| `tags` | string[] | ❌ | Categorization tags |
| `priority` | enum | ❌ | `low`, `medium`, `high`, `urgent` |
| `subagentSession` | string | ❌ | Sub-agent session ID |

## 🎨 Customization

### Colors

The theme uses Tailwind's slate palette with cyan accents. To customize:

```css
/* app/globals.css */
@theme {
  --color-primary: oklch(0.7 0.2 200); /* cyan */
  --color-background: oklch(0.15 0.01 240); /* dark slate */
}
```

### Polling Interval

Change the refresh rate in `components/KanbanBoard.tsx`:

```typescript
// Default: 30 seconds
const interval = setInterval(fetchTasks, 30000);

// Change to 60 seconds
const interval = setInterval(fetchTasks, 60000);
```

## 🔧 Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🐛 Troubleshooting

**Dashboard not updating?**
- Check that `/home/claudebot/clawd/mission-control.json` exists
- Verify JSON is valid (use `jq` to check)
- Check browser console for errors

**API route failing?**
- Ensure file permissions allow reading
- Check that the path in `app/api/tasks/route.ts` is correct

**Styling issues?**
- Clear `.next` cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## 📚 Project Structure

```
dasbot-mission-control/
├── app/
│   ├── api/
│   │   └── tasks/
│   │       └── route.ts          # API endpoint for tasks
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── KanbanBoard.tsx           # Main board component
│   ├── KanbanColumn.tsx          # Column component
│   └── TaskCard.tsx              # Task card component
├── types/
│   └── task.ts                   # TypeScript types
└── README.md                     # This file
```

## 🚀 Future Enhancements

- [ ] Drag-and-drop between columns
- [ ] WebSocket support for instant updates
- [ ] Task filtering and search
- [ ] Dark/light theme toggle
- [ ] Export to CSV/JSON
- [ ] Integration with Clawdbot Gateway API
- [ ] Task editing inline
- [ ] Keyboard shortcuts
- [ ] Task history/changelog

## 📄 License

Built with ❤️ for DasBot by Claude (Subagent).

---

**Questions?** Check the code or ask Dan!
