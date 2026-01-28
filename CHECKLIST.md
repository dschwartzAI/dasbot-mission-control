# ✅ Mission Control Dashboard - Verification Checklist

Use this checklist to verify the dashboard is working correctly.

## 🚀 Initial Setup

- [ ] **Navigate to project**
  ```bash
  cd /home/claudebot/clawd/projects/dasbot-mission-control
  ```

- [ ] **Verify files exist**
  ```bash
  ls -la  # Should see app/, components/, types/, etc.
  ```

- [ ] **Check data file exists**
  ```bash
  cat /home/claudebot/clawd/mission-control.json
  ```

- [ ] **Install dependencies** (if not already done)
  ```bash
  npm install
  ```

## 🧪 Local Testing

- [ ] **Start development server**
  ```bash
  ./start.sh
  # OR
  npm run dev
  ```

- [ ] **Open browser**
  - Navigate to `http://localhost:3000`
  - Should see dashboard load

- [ ] **Verify all columns appear**
  - [ ] 🆕 Backlog (should have 3 tasks)
  - [ ] 🔄 In Progress (should have 1 task)
  - [ ] ⏸️ Waiting (should have 2 tasks)
  - [ ] ✅ Done (Today) (should have 2 tasks)
  - [ ] 📅 Scheduled (should have 2 tasks)

- [ ] **Check card details**
  - [ ] Task titles visible
  - [ ] Descriptions truncated to 2 lines
  - [ ] Priority badges show correct colors
  - [ ] Progress bars animate smoothly
  - [ ] Tags display (truncated if >3)
  - [ ] Timestamps show relative time (e.g., "2h", "3d")

- [ ] **Test interactivity**
  - [ ] Hover over cards (border glows cyan)
  - [ ] Click a card (modal opens)
  - [ ] Modal shows full details
  - [ ] Click outside modal (closes)
  - [ ] Click "Refresh" button (spins, updates data)

## 🎨 Visual Verification

- [ ] **Dark theme applied**
  - Background: Dark slate
  - Text: Light gray/white
  - Accents: Cyan/blue

- [ ] **Borders colored by column**
  - Backlog: Gray
  - In Progress: Blue
  - Waiting: Yellow
  - Done: Green
  - Scheduled: Purple

- [ ] **Animations smooth**
  - Card hover effects
  - Progress bar transitions
  - Modal open/close

- [ ] **Typography clear**
  - Inter font loads
  - No font flashing
  - Readable sizes

## 📱 Responsive Testing

- [ ] **Desktop (> 1024px)**
  - All 5 columns visible
  - Cards width ~320px
  - Horizontal scroll works

- [ ] **Tablet (768px - 1023px)**
  - 3 columns visible
  - Horizontal scroll
  - Cards responsive

- [ ] **Mobile (< 768px)**
  - Single column view
  - Full width cards
  - Touch interactions work

**Test resize:**
```bash
# Open dev tools (F12)
# Toggle device toolbar
# Test different screen sizes
```

## 🔄 Real-time Updates

- [ ] **Test polling**
  1. Open dashboard
  2. Edit `/home/claudebot/clawd/mission-control.json`
  3. Change a task title or status
  4. Wait 30 seconds
  5. Dashboard should update automatically

- [ ] **Test manual refresh**
  1. Edit JSON file
  2. Click "Refresh" button immediately
  3. Should update without waiting

## 🔗 Link Testing

- [ ] **Click external links in modal**
  - Should open in new tab
  - No errors in console

- [ ] **File links work**
  - `file://` URLs may not open in browser (security)
  - This is expected behavior

## 🏗️ Build Verification

- [ ] **Production build succeeds**
  ```bash
  npm run build
  # Should complete with no errors
  ```

- [ ] **Build output looks correct**
  - Should see routes compiled
  - No TypeScript errors
  - No warnings (except Next.js telemetry)

- [ ] **Production server starts**
  ```bash
  npm start
  # Open http://localhost:3000
  ```

## 📊 Data Testing

- [ ] **Empty data handling**
  ```bash
  # Backup current data
  cp /home/claudebot/clawd/mission-control.json /tmp/backup.json
  
  # Create empty data
  echo '{"tasks":[],"lastUpdated":"2025-01-20T00:00:00Z"}' > /home/claudebot/clawd/mission-control.json
  
  # Refresh dashboard
  # Should show "No tasks" in all columns
  
  # Restore
  cp /tmp/backup.json /home/claudebot/clawd/mission-control.json
  ```

- [ ] **Invalid JSON handling**
  ```bash
  # Backup
  cp /home/claudebot/clawd/mission-control.json /tmp/backup.json
  
  # Break JSON
  echo '{invalid}' > /home/claudebot/clawd/mission-control.json
  
  # Refresh dashboard
  # Should gracefully show empty state
  
  # Restore
  cp /tmp/backup.json /home/claudebot/clawd/mission-control.json
  ```

- [ ] **All task fields render**
  - [ ] With progress bar
  - [ ] Without progress bar
  - [ ] With tags
  - [ ] Without tags
  - [ ] With links
  - [ ] Without links
  - [ ] With priority
  - [ ] Without priority
  - [ ] With timestamps
  - [ ] Without timestamps

## 🚀 Deployment Prep

- [ ] **Review DEPLOYMENT.md**
  - Understand deployment options
  - Choose deployment target

- [ ] **Environment variables ready** (if deploying)
  - Know how to set `MISSION_CONTROL_DATA`
  - OR have API endpoint ready

- [ ] **Git repository set up**
  ```bash
  git init
  git add .
  git commit -m "Initial commit: Mission Control Dashboard"
  ```

- [ ] **Vercel CLI installed** (if using Vercel)
  ```bash
  npm install -g vercel
  vercel login
  ```

## 📚 Documentation Review

- [ ] **README.md read**
  - Understand project structure
  - Know how to customize
  - Deployment options clear

- [ ] **DEPLOYMENT.md read**
  - Vercel steps understood
  - Alternative options known

- [ ] **PROJECT_SUMMARY.md read**
  - Feature list understood
  - Limitations known

- [ ] **VISUAL_GUIDE.md browsed**
  - Design system understood
  - Color scheme noted

## 🎯 Final Checks

- [ ] **No console errors**
  - Open browser console (F12)
  - No red errors
  - Warnings are acceptable

- [ ] **Performance acceptable**
  - Page loads quickly
  - Interactions smooth
  - No lag on scroll

- [ ] **Works in preferred browser**
  - Chrome
  - Firefox
  - Safari
  - Edge

- [ ] **Sample data makes sense**
  - Tasks are realistic
  - Demonstrates all features
  - Can be used as template

## ✨ Optional Enhancements

- [ ] **Customize sample data**
  - Replace with real tasks
  - Update mission-control.json

- [ ] **Adjust polling interval**
  - Change from 30s if needed
  - Edit KanbanBoard.tsx

- [ ] **Customize colors**
  - Edit globals.css
  - Update theme colors

- [ ] **Add more tasks**
  - Create varied examples
  - Test with many tasks

## 🎉 Completion Checklist

When you've verified everything:

- [ ] Dashboard runs locally without errors
- [ ] All features work as expected
- [ ] Visual design looks good
- [ ] Documentation is clear
- [ ] Ready to deploy (or already deployed)
- [ ] Data format understood
- [ ] Customization options noted

## 🐛 If Something's Wrong

1. **Check console for errors**
   ```bash
   # In browser dev tools
   Console tab → Look for red errors
   ```

2. **Verify file paths**
   ```bash
   # Ensure JSON file exists
   ls -la /home/claudebot/clawd/mission-control.json
   ```

3. **Restart dev server**
   ```bash
   # Kill server (Ctrl+C)
   # Clear cache
   rm -rf .next
   # Restart
   npm run dev
   ```

4. **Reinstall dependencies**
   ```bash
   rm -rf node_modules
   npm install
   ```

5. **Check Node version**
   ```bash
   node --version  # Should be 18+
   ```

---

## 📝 Notes

Use this space to note any issues or customizations:

```
[Your notes here]
```

---

**Checklist Complete?** You're ready to go! 🚀

For questions or issues, refer to:
- README.md (features & usage)
- DEPLOYMENT.md (deployment)
- PROJECT_SUMMARY.md (architecture)
- VISUAL_GUIDE.md (design)

Or ask Dan/Claude for help!
