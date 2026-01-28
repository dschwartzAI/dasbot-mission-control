#!/usr/bin/env node
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

const http = require('http');
const fs = require('fs');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);
const PORT = 3001;
const TASKS_FILE = path.join(__dirname, '../todays-tasks.json');
const FINANCIAL_FILE = path.join(__dirname, '../financial-data.json');

// Cache to prevent hammering APIs
const cache = {
  gmail: { data: null, timestamp: 0, ttl: 60000 }, // 1 min
  calendar: { data: null, timestamp: 0, ttl: 300000 }, // 5 min
  slack: { data: null, timestamp: 0, ttl: 60000 }, // 1 min
  github: { data: null, timestamp: 0, ttl: 300000 }, // 5 min
  financial: { data: null, timestamp: 0, ttl: 60000 }, // 1 min
};

function getCached(key) {
  const entry = cache[key];
  if (entry && entry.data && Date.now() - entry.timestamp < entry.ttl) {
    return entry.data;
  }
  return null;
}

function setCache(key, data) {
  cache[key].data = data;
  cache[key].timestamp = Date.now();
}

async function getGmailData() {
  const cached = getCached('gmail');
  if (cached) return cached;

  try {
    // Get unread count and recent important emails
    const { stdout } = await execAsync('gog gmail search --json --max=10 "is:unread"');
    const result = JSON.parse(stdout);
    
    const data = {
      unreadCount: result.threads?.length || 0,
      threads: result.threads || [],
      lastChecked: new Date().toISOString(),
    };
    
    setCache('gmail', data);
    return data;
  } catch (error) {
    console.error('Gmail error:', error.message);
    return { unreadCount: 0, threads: [], error: error.message, lastChecked: new Date().toISOString() };
  }
}

async function getCalendarData() {
  const cached = getCached('calendar');
  if (cached) return cached;

  try {
    const { stdout } = await execAsync('gog calendar events --json --from=today --max=10');
    const result = JSON.parse(stdout);
    
    const data = {
      events: result.events || [],
      lastChecked: new Date().toISOString(),
    };
    
    setCache('calendar', data);
    return data;
  } catch (error) {
    console.error('Calendar error:', error.message);
    return { events: [], error: error.message, lastChecked: new Date().toISOString() };
  }
}

async function getSlackData() {
  const cached = getCached('slack');
  if (cached) return cached;

  try {
    const SLACK_TOKEN = process.env.SLACK_BOT_TOKEN || '';
    const CHANNEL_ID = process.env.SLACK_CHANNEL_ID || 'C0A2QMXGB6D'; // dan-sansa-external
    
    if (!SLACK_TOKEN) {
      throw new Error('SLACK_BOT_TOKEN not configured');
    }
    
    // Fetch recent messages
    const { stdout } = await execAsync(
      `curl -s -H "Authorization: Bearer ${SLACK_TOKEN}" "https://slack.com/api/conversations.history?channel=${CHANNEL_ID}&limit=20"`
    );
    
    const result = JSON.parse(stdout);
    
    if (!result.ok) {
      throw new Error(result.error || 'Slack API error');
    }
    
    const messages = result.messages || [];
    
    // Get user info for DasBot to filter out own messages
    const { stdout: authInfo } = await execAsync(
      `curl -s -H "Authorization: Bearer ${SLACK_TOKEN}" "https://slack.com/api/auth.test"`
    );
    const authResult = JSON.parse(authInfo);
    const botUserId = authResult.user_id;
    
    // Filter to get mentions and recent human messages
    const mentions = messages.filter(m => 
      m.text && m.text.includes(`<@${botUserId}>`) && m.user !== botUserId
    );
    
    const recentMessages = messages
      .filter(m => m.user !== botUserId)
      .slice(0, 5)
      .map(m => ({
        user: m.user,
        text: m.text,
        timestamp: m.ts,
      }));
    
    const data = {
      mentionCount: mentions.length,
      mentions: mentions.slice(0, 5),
      recentMessages,
      lastChecked: new Date().toISOString(),
    };
    
    setCache('slack', data);
    return data;
  } catch (error) {
    console.error('Slack error:', error.message);
    return { mentionCount: 0, mentions: [], recentMessages: [], error: error.message, lastChecked: new Date().toISOString() };
  }
}

async function getGitHubData() {
  const cached = getCached('github');
  if (cached) return cached;

  try {
    // Get PRs and recent activity for key repos
    const repos = [
      'dschwartzAI/dasbot-mission-control',
      'dschwartzAI/toolchat-ai',
    ];
    
    const data = {
      openPRs: 0,
      recentCommits: [],
      repos: [],
      lastChecked: new Date().toISOString(),
    };
    
    // For now, return mock data - would need GitHub token to implement
    data.repos = repos.map(repo => ({
      name: repo,
      openPRs: 0,
      lastCommit: 'N/A - GitHub token needed',
    }));
    
    setCache('github', data);
    return data;
  } catch (error) {
    console.error('GitHub error:', error.message);
    return { openPRs: 0, recentCommits: [], repos: [], error: error.message, lastChecked: new Date().toISOString() };
  }
}

function getFinancialData() {
  const cached = getCached('financial');
  if (cached) return cached;

  try {
    if (fs.existsSync(FINANCIAL_FILE)) {
      const data = JSON.parse(fs.readFileSync(FINANCIAL_FILE, 'utf-8'));
      setCache('financial', data);
      return data;
    } else {
      // Create default financial file
      const defaultData = {
        cash: 22000,
        monthlyBurn: 3000,
        runway: 7.3,
        lastUpdated: new Date().toISOString(),
        notes: "Update this file manually with: vim ~/clawd/financial-data.json"
      };
      fs.writeFileSync(FINANCIAL_FILE, JSON.stringify(defaultData, null, 2));
      setCache('financial', defaultData);
      return defaultData;
    }
  } catch (error) {
    console.error('Financial error:', error.message);
    return { cash: 0, monthlyBurn: 0, runway: 0, error: error.message };
  }
}

function getToolChatData() {
  // Mock ToolChat data - would need actual API integration
  return {
    activeUsers: 12,
    whiteLabels: 3,
    supportTickets: 2,
    lastChecked: new Date().toISOString(),
    note: "Connect to ToolChat API for real data"
  };
}

async function getDasBotData() {
  try {
    // Get sub-agents from Gateway
    let sessions = [];
    let crons = [];
    let completed = [];
    
    try {
      const { stdout: sessionsOut } = await execAsync('curl -s http://localhost:3002/sessions');
      sessions = JSON.parse(sessionsOut).sessions || [];
    } catch (e) {
      console.error('Sessions error:', e.message);
    }
    
    try {
      const { stdout: cronsOut } = await execAsync('curl -s http://localhost:3002/cron');
      crons = JSON.parse(cronsOut).jobs || [];
    } catch (e) {
      console.error('Cron error:', e.message);
    }
    
    try {
      if (fs.existsSync(TASKS_FILE)) {
        completed = JSON.parse(fs.readFileSync(TASKS_FILE, 'utf-8')).tasks || [];
      }
    } catch (e) {
      console.error('Tasks error:', e.message);
    }
    
    return {
      activeSubAgents: sessions.length,
      scheduledCrons: crons.length,
      completedToday: completed.length,
      sessions: sessions.slice(0, 5),
      crons: crons.slice(0, 5),
      recentTasks: completed.slice(-5),
    };
  } catch (error) {
    console.error('DasBot data error:', error.message);
    return { activeSubAgents: 0, scheduledCrons: 0, completedToday: 0, error: error.message };
  }
}

const server = http.createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);

  try {
    if (req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    } 
    else if (req.url === '/dashboard') {
      // Aggregate endpoint that returns everything
      const [gmail, calendar, slack, github, financial, toolchat, dasbot] = await Promise.all([
        getGmailData(),
        getCalendarData(),
        getSlackData(),
        getGitHubData(),
        getFinancialData(),
        getToolChatData(),
        getDasBotData(),
      ]);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        gmail,
        calendar,
        slack,
        github,
        financial,
        toolchat,
        dasbot,
        timestamp: new Date().toISOString(),
      }));
    }
    else if (req.url === '/gmail') {
      const data = await getGmailData();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    }
    else if (req.url === '/calendar') {
      const data = await getCalendarData();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    }
    else if (req.url === '/slack') {
      const data = await getSlackData();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    }
    else if (req.url === '/github') {
      const data = await getGitHubData();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    }
    else if (req.url === '/financial') {
      const data = getFinancialData();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    }
    else if (req.url === '/toolchat') {
      const data = getToolChatData();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    }
    else if (req.url === '/dasbot') {
      const data = await getDasBotData();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    }
    // Legacy endpoints for compatibility
    else if (req.url === '/sessions') {
      const data = await getDasBotData();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ sessions: data.sessions || [] }));
    }
    else if (req.url === '/cron') {
      const data = await getDasBotData();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ jobs: data.crons || [] }));
    }
    else if (req.url === '/completed') {
      try {
        const data = fs.readFileSync(TASKS_FILE, 'utf-8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to read tasks file', tasks: [] }));
      }
    }
    else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        error: 'Not found',
        availableEndpoints: [
          '/health',
          '/dashboard',
          '/gmail',
          '/calendar',
          '/slack',
          '/github',
          '/financial',
          '/toolchat',
          '/dasbot',
          '/sessions',
          '/cron',
          '/completed',
        ]
      }));
    }
  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: error.message }));
  }
});

server.listen(PORT, () => {
  console.log(`Gateway API v2.0 running on :${PORT}`);
  console.log('Endpoints:');
  console.log('  /health - Health check');
  console.log('  /dashboard - All data in one call');
  console.log('  /gmail - Email summary');
  console.log('  /calendar - Calendar events');
  console.log('  /slack - Slack mentions & messages');
  console.log('  /github - GitHub activity');
  console.log('  /financial - Financial snapshot');
  console.log('  /toolchat - ToolChat metrics');
  console.log('  /dasbot - DasBot activity');
});
