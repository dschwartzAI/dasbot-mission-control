# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
npm start        # Start production server
```

## Architecture

This is a Next.js 16 Kanban dashboard that displays DasBot/Clawdbot tasks. It reads directly from the **Clawdbot Gateway APIs** — no separate database or file sync needed.

### Data Flow

```
Clawdbot Gateway (VPS)     →     Vercel (Dashboard)
    ↓                                  ↓
/api/sessions              →     In Progress column
/api/cron/list             →     Scheduled column
```

1. Gateway is the source of truth (sessions, cron jobs, memory)
2. Dashboard fetches via Tailscale-secured connection
3. Client polls `/api/tasks` every 30 seconds for updates

### Environment Variables

```bash
GATEWAY_URL=https://<machine>.<tailnet>.ts.net:18789
GATEWAY_TOKEN=<your-gateway-token>
```

### Key Files

- `lib/gateway.ts` - Gateway API client and data transformers
- `types/task.ts` - Task interface and status types
- `components/KanbanBoard.tsx` - Main board with polling logic
- `app/api/tasks/route.ts` - API endpoint proxying Gateway data

### Task Status Mapping

| Gateway Source | Dashboard Status |
|----------------|------------------|
| Active sessions (with label) | `in-progress` |
| Cron jobs | `scheduled` |

### Extending

To add more columns (backlog, waiting, done), extend `lib/gateway.ts` to:
- Parse memory files for completed tasks
- Add webhook handlers for task state changes
- Query additional Gateway endpoints as they become available
