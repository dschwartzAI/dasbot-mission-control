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
const TASKS_HISTORY_DIR = path.join(__dirname, '../memory/tasks-history');

// Cache to prevent hammering APIs
const cache = {
  gmail: { data: null, timestamp: 0, ttl: 60000 }, // 1 min
  calendar: { data: null, timestamp: 0, ttl: 300000 }, // 5 min
  tasks: { data: null, timestamp: 0, ttl: 30000 }, // 30 sec
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

// Important email detection logic (from email-monitoring-rules.md)
function isImportantEmail(thread) {
  const from = (thread.from || '').toLowerCase();
  const subject = (thread.subject || '').toLowerCase();
  
  // High priority people
  const importantPeople = [
    'james',
    'alex',
    'white label',
    'investor',
    'partner',
  ];
  
  if (importantPeople.some(person => from.includes(person))) {
    return true;
  }
  
  // Urgent keywords
  const urgentKeywords = [
    'urgent', 'asap', 'payment', 'invoice', 'problem', 
    'error', 'down', 'critical', 'help', 'emergency'
  ];
  
  if (urgentKeywords.some(keyword => subject.includes(keyword))) {
    return true;
  }
  
  // Important keywords
  const importantKeywords = [
    'contract', 'agreement', 'proposal', 'meeting', 
    'schedule', 'call', 'review'
  ];
  
  if (importantKeywords.some(keyword => subject.includes(keyword))) {
    return true;
  }
  
  // Business-related mentions
  if (subject.includes('toolchat') || subject.includes('sansa')) {
    return true;
  }
  
  // Dollar amounts
  if (subject.match(/\$[\d,]+/)) {
    return true;
  }
  
  return false;
}

async function getImportantEmails() {
  const cached = getCached('gmail');
  if (cached) return cached;

  try {
    const { stdout } = await execAsync('gog gmail search --json --max=30 "is:unread"');
    const result = JSON.parse(stdout);
    
    // Filter to only important emails
    const allThreads = result.threads || [];
    const importantThreads = allThreads.filter(isImportantEmail);
    
    const data = {
      unreadCount: allThreads.length,
      importantCount: importantThreads.length,
      threads: importantThreads.slice(0, 5), // Top 5 important
      lastChecked: new Date().toISOString(),
    };
    
    setCache('gmail', data);
    return data;
  } catch (error) {
    console.error('Gmail error:', error.message);
    return { 
      unreadCount: 0, 
      importantCount: 0, 
      threads: [], 
      error: error.message, 
      lastChecked: new Date().toISOString() 
    };
  }
}

async function getUpcomingCalendar() {
  const cached = getCached('calendar');
  if (cached) return cached;

  try {
    const { stdout } = await execAsync('gog calendar events --json --from=today --max=5');
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

async function getTaskStats() {
  const cached = getCached('tasks');
  if (cached) return cached;

  try {
    // Get today's tasks
    let todayTasks = [];
    if (fs.existsSync(TASKS_FILE)) {
      const todayData = JSON.parse(fs.readFileSync(TASKS_FILE, 'utf-8'));
      todayTasks = todayData.tasks || [];
    }
    
    // Get active sub-agents
    let activeSessions = 0;
    try {
      const { stdout } = await execAsync('curl -s http://localhost:3002/sessions');
      const sessionsData = JSON.parse(stdout);
      activeSessions = (sessionsData.sessions || []).length;
    } catch (e) {
      console.error('Sessions error:', e.message);
    }
    
    // Calculate stats from history (last 7 days)
    let weekTasks = [];
    const now = new Date();
    
    if (fs.existsSync(TASKS_HISTORY_DIR)) {
      for (let i = 0; i < 7; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const historyFile = path.join(TASKS_HISTORY_DIR, `${dateStr}.json`);
        
        if (fs.existsSync(historyFile)) {
          try {
            const dayData = JSON.parse(fs.readFileSync(historyFile, 'utf-8'));
            weekTasks = weekTasks.concat(dayData.tasks || []);
          } catch (e) {
            // Skip invalid files
          }
        }
      }
    }
    
    // Also include today
    weekTasks = weekTasks.concat(todayTasks);
    
    // Calculate total tasks (rough estimate from available data)
    const totalTasks = weekTasks.length * 4; // Rough estimate
    const completedTasks = weekTasks.filter(t => 
      t.status === 'done' || t.status === 'completed'
    ).length;
    
    const completion = totalTasks > 0 
      ? Math.round((completedTasks / totalTasks) * 100) 
      : 0;
    
    const data = {
      thisWeek: weekTasks.length,
      inProgress: activeSessions,
      total: totalTasks,
      completion: completion,
      recentTasks: todayTasks.slice(-10).reverse(),
    };
    
    setCache('tasks', data);
    return data;
  } catch (error) {
    console.error('Task stats error:', error.message);
    return {
      thisWeek: 0,
      inProgress: 0,
      total: 0,
      completion: 0,
      recentTasks: [],
      error: error.message,
    };
  }
}

async function getActivityFeed() {
  // Get recent DasBot actions from task history
  try {
    let todayTasks = [];
    if (fs.existsSync(TASKS_FILE)) {
      const todayData = JSON.parse(fs.readFileSync(TASKS_FILE, 'utf-8'));
      todayTasks = todayData.tasks || [];
    }
    
    return todayTasks.slice(-10).reverse().map(task => ({
      type: task.status === 'done' ? 'completed' : 'started',
      title: task.title || task.description,
      timestamp: task.timestamp || task.createdAt,
    }));
  } catch (error) {
    console.error('Activity feed error:', error.message);
    return [];
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
      res.end(JSON.stringify({ status: 'ok', version: 'v3.0', timestamp: new Date().toISOString() }));
    } 
    else if (req.url === '/dashboard') {
      // v3: Streamlined dashboard with Kanban focus
      const [emails, calendar, taskStats, activity] = await Promise.all([
        getImportantEmails(),
        getUpcomingCalendar(),
        getTaskStats(),
        getActivityFeed(),
      ]);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        emails,
        calendar,
        taskStats,
        activity,
        timestamp: new Date().toISOString(),
      }));
    }
    else if (req.url === '/tasks') {
      const data = await getTaskStats();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    }
    else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        error: 'Not found',
        version: 'v3.0',
        availableEndpoints: [
          '/health',
          '/dashboard',
          '/tasks',
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
  console.log(`Gateway API v3.0 (Mission Control Redesign) running on :${PORT}`);
  console.log('Endpoints:');
  console.log('  /health - Health check');
  console.log('  /dashboard - Kanban-focused dashboard data');
  console.log('  /tasks - Task statistics');
});
