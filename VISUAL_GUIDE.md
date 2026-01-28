# 📸 Visual Guide - Mission Control Dashboard

## Dashboard Layout

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 🚀 DasBot Mission Control                      [🔄 Refresh]              ┃
┃ Last updated: 12:34:56 PM                                                ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┩
│                                                                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │ 🆕 Backlog│  │🔄In Prog  │  │⏸️ Waiting │  │✅ Done     │  │📅 Schedule│ │
│  │     3    │  │     2     │  │     2    │  │     2     │  │     1    │ │
│  ├──────────┤  ├──────────┤  ├──────────┤  ├──────────┤  ├──────────┤ │
│  │          │  │          │  │          │  │          │  │          │ │
│  │ ┌──────┐ │  │ ┌──────┐ │  │ ┌──────┐ │  │ ┌──────┐ │  │ ┌──────┐ │ │
│  │ │Task 1│ │  │ │Task 5│ │  │ │Task 8│ │  │ │Task A│ │  │ │Task X│ │ │
│  │ │[HIGH]│ │  │ │[MED] │ │  │ │[LOW] │ │  │ │      │ │  │ │      │ │ │
│  │ │      │ │  │ │━━━━━━│ │  │ │      │ │  │ │      │ │  │ │      │ │ │
│  │ │░░85% │ │  │ │░░░45%│ │  │ │#tags │ │  │ │✓ Done│ │  │ │📅 9am│ │ │
│  │ │🔗 2h  │ │  │ │🤖 Agt│ │  │ │⏰ 3d │ │  │ │      │ │  │ │      │ │ │
│  │ └──────┘ │  │ └──────┘ │  │ └──────┘ │  │ └──────┘ │  │ └──────┘ │ │
│  │          │  │          │  │          │  │          │  │          │ │
│  │ ┌──────┐ │  │ ┌──────┐ │  │ ┌──────┐ │  │ ┌──────┐ │  │          │ │
│  │ │Task 2│ │  │ │Task 6│ │  │ │Task 9│ │  │ │Task B│ │  │          │ │
│  │ └──────┘ │  │ └──────┘ │  │ └──────┘ │  │ └──────┘ │  │          │ │
│  │          │  │          │  │          │  │          │  │          │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
│                                                                           │
│ 10 total tasks • 2 active • 2 completed today   Built with Next.js + shadcn│
└───────────────────────────────────────────────────────────────────────────┘
```

---

## Color Scheme

```
┌─────────────────────────────────────────────────┐
│ Primary Background: #0f172a (Slate 950)        │
│ Card Background:    #1e293b (Slate 900/50)     │
│ Border:             #334155 (Slate 700)        │
│ Text Primary:       #f1f5f9 (Slate 100)        │
│ Text Secondary:     #94a3b8 (Slate 400)        │
│ Accent:             #06b6d4 (Cyan 500)         │
│ Success:            #22c55e (Green 500)        │
│ Warning:            #eab308 (Yellow 500)       │
│ Error:              #ef4444 (Red 500)          │
└─────────────────────────────────────────────────┘
```

---

## Task Card Structure

```
┌─────────────────────────────────────────────┐
│ Task Title                       [PRIORITY] │  ← Header
├─────────────────────────────────────────────┤
│ Brief description that may span             │  ← Description
│ multiple lines, truncated at 2 lines        │
│                                             │
│ Progress                            75%     │  ← Progress Bar
│ ████████████████░░░░░░░░░░                  │
│                                             │
│ [tag1] [tag2] [tag3] [+2]                   │  ← Tags
│                                             │
│ 🕐 2h    📅 tomorrow    🤖 agent           │  ← Metadata
└─────────────────────────────────────────────┘
```

### Card States

**Default (Hover Off)**
- Background: `rgba(15, 23, 42, 0.5)`
- Border: `rgba(100, 116, 139, 0.5)`
- Opacity: 100%

**Hover**
- Border: Cyan glow `rgba(6, 182, 212, 0.5)`
- Shadow: Cyan shadow `rgba(6, 182, 212, 0.1)`
- Transform: Slight scale
- Cursor: Pointer

**Clicked (Modal Open)**
- Modal overlay: Dark backdrop
- Modal: Large centered card
- Full task details visible

---

## Priority Badges

```
┌──────────────────────────────────────────┐
│ [URGENT]  Red     #ef4444 on #7f1d1d    │
│ [HIGH]    Orange  #f97316 on #7c2d12    │
│ [MEDIUM]  Yellow  #eab308 on #713f12    │
│ [LOW]     Blue    #3b82f6 on #1e3a8a    │
└──────────────────────────────────────────┘
```

---

## Column Colors

Each column has a distinct border accent:

```
🆕 Backlog    │ Gray    #64748b (Slate 600)
🔄 In Progress│ Blue    #3b82f6 (Blue 500)
⏸️ Waiting    │ Yellow  #eab308 (Yellow 500)
✅ Done       │ Green   #22c55e (Green 500)
📅 Scheduled  │ Purple  #a855f7 (Purple 500)
```

---

## Detail Modal Layout

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  Task Title Here                     [PRIORITY] │
│  ─────────────────────────────────────────────  │
│  Detailed description text that can be much     │
│  longer than the card preview allows...         │
│                                                 │
│  Progress                                  85%  │
│  ████████████████████████░░░░░░░░░              │
│                                                 │
│  ┌──────────────────┬──────────────────┐       │
│  │ Started          │ Est. Completion  │       │
│  │ Jan 19, 10:00 PM │ Jan 20, 8:00 AM  │       │
│  └──────────────────┴──────────────────┘       │
│                                                 │
│  Sub-agent Session                              │
│  agent:main:subagent:54b57226-6418-...          │
│                                                 │
│  Tags                                           │
│  [frontend] [nextjs] [ui/ux] [high-priority]   │
│                                                 │
│  Links                                          │
│  ┌───────────────────────────────────┐         │
│  │ 🔗 Project Directory      [file]  │         │
│  ├───────────────────────────────────┤         │
│  │ 🔗 GitHub Repo          [github]  │         │
│  └───────────────────────────────────┘         │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Responsive Breakpoints

### Desktop (1024px+)
- All 5 columns visible side-by-side
- Cards width: 320px
- Horizontal scroll if needed

### Tablet (768px - 1023px)
- 3 columns visible at once
- Horizontal scroll for more
- Cards width: 280px

### Mobile (< 768px)
- 1 column at a time
- Full width cards
- Swipe to change columns
- Sticky header

---

## Animation Details

### Card Hover
```css
transition: all 0.2s ease-in-out;
transform: translateY(-2px);
box-shadow: 0 10px 30px rgba(6, 182, 212, 0.1);
```

### Progress Bar
```css
transition: width 0.5s ease-out;
background: linear-gradient(to right, #06b6d4, #3b82f6);
```

### Modal Open
```css
backdrop: blur(8px);
modal: scale from 0.95 to 1, fade in 0.2s;
```

### Refresh Button
```css
rotate: infinite spin when active;
animation-duration: 1s;
```

---

## Typography

### Font Family
- **Primary**: Inter (Google Fonts)
- **Monospace**: System mono (for IDs, timestamps)

### Font Sizes
```
Header Title:      24px (text-2xl) - Bold
Column Title:      18px (text-lg) - Semibold
Card Title:        14px (text-sm) - Medium
Card Description:  12px (text-xs) - Regular
Metadata:          12px (text-xs) - Regular
Footer:            12px (text-xs) - Regular
```

---

## Icon Usage

### Column Headers
- 🆕 Backlog (new emoji)
- 🔄 In Progress (arrows_counterclockwise)
- ⏸️ Waiting (pause_button)
- ✅ Done (check_mark_button)
- 📅 Scheduled (calendar)

### Card Metadata
- 🕐 Clock (lucide-react: Clock) - Time estimate
- 📅 Calendar (lucide-react: Calendar) - Scheduled date
- 🤖 Terminal (lucide-react: Terminal) - Sub-agent
- 🔗 Link (lucide-react: ExternalLink) - External links

### UI Actions
- 🔄 Refresh (lucide-react: RefreshCw)
- ↗️ External (lucide-react: ExternalLink)

---

## Accessibility Features

- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **ARIA Labels**: Proper labels on buttons and interactive elements
- **Focus Indicators**: Visible focus outlines
- **Semantic HTML**: Proper heading hierarchy
- **Color Contrast**: WCAG AA compliant
- **Screen Reader**: Descriptive text for all icons

---

## Loading States

### Initial Load
- Server-side rendered with initial data
- No loading spinner needed

### Polling Update
- Refresh button shows spinning icon
- No interruption to user experience

### Error State
- Falls back to empty task list
- Console error logged

---

## Empty States

### No Tasks
```
┌──────────────────────┐
│                      │
│                      │
│     No tasks         │
│                      │
│                      │
└──────────────────────┘
```

### Column Empty
- Shows "No tasks" message
- Centered in column
- Subtle gray text

---

## Performance Optimizations

- **Server-Side Rendering**: Initial page load
- **Code Splitting**: Automatic by Next.js
- **Image Optimization**: Not needed (no images)
- **CSS Purging**: Unused styles removed
- **Lazy Loading**: Modal components
- **Memoization**: Component-level optimizations

---

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile Safari (iOS 14+)
- ✅ Chrome Mobile (Android 5+)

---

## Dark Mode Only

This dashboard is **dark mode by default**. There's no light mode toggle (yet), as it's designed specifically for the dark theme aesthetic inspired by NASA mission control interfaces.

To add light mode support in the future, you would:
1. Add `next-themes` package
2. Define light color palette
3. Add theme toggle button
4. Update all components with theme-aware classes

---

**Visual Guide Complete** 🎨

For actual screenshots, run the dashboard locally and take screenshots, or deploy to Vercel and use their screenshot API.
