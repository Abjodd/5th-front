# 5th Avenue — Client Portal

**Client:** FreshBite Foods (Pvt. Ltd.)  
**Agency:** 5th Avenue Marketing — Influencer Marketing, AEO, Offline Activation

---

## Quick Start

```bash
npm install
npm run dev
```

Opens at `http://localhost:3000`

---

## Architecture

```
src/
├── main.jsx              # React entry point
├── App.jsx               # Shell — sidebar, routing, shared theme/role context
└── pages/
    ├── Overview.jsx       # Dashboard — MECE structure, creator filters, auto-insights
    ├── Campaigns.jsx      # Kanban/Grid, detail panel, brief wizard, approval system
    ├── RegionalMap.jsx    # India SVG map, state/region/language views, drill-down
    ├── Notifications.jsx  # Unified feed, inline actions, grouped by date
    ├── Billing.jsx        # Invoices, Razorpay flow, retainer + campaign billing
    └── Settings.jsx       # Profile, team, notifications, security, linked accounts
```

### Shared App Context (`useApp`)

Every page imports `useApp()` from `App.jsx` to access:

| Key | Type | Description |
|-----|------|-------------|
| `P` | object | Active palette (DARK or LIGHT) |
| `theme` | string | `"dark"` or `"light"` |
| `setTheme` | fn | Toggle theme |
| `role` | string | `"owner"` / `"admin"` / `"member"` |
| `setRole` | fn | Change role (demo) |
| `page` | string | Current page ID |
| `setPage` | fn(pageId, params?) | Navigate to page with optional params |
| `navParams` | object | Params from cross-page navigation |

### Cross-Page Navigation

- **Notifications → Campaigns:** "Full Context" button calls `setPage("campaigns", { campaignId })`
- **Regional Map → Campaigns:** "Open Campaign Page" calls `setPage("campaigns", { campaignId })`
- **Overview → Campaigns:** Top campaigns list (wired for future)
- **Sidebar badges:** Unread notifications count, unpaid invoices count

### Theme

- **Dark:** `#050A18` background, `#5B9BFF` accent
- **Light:** `#F5F7FA` background, `#3B7FE8` accent
- **Fonts:** Sora (body) + Newsreader (italic serif headers)
- Theme toggle in sidebar footer, synced across all pages

### Role System

Two separate role concepts:

1. **Access Role** (Settings): Owner → Admin → Member — controls what sections are visible/editable
2. **View Role** (Overview): Founder → Manager → Content — changes which KPIs and metrics are shown

---

## Pages Summary

### Overview (`/overview`)
- Service tabs: Overall / Influencer / AEO / Offline / Ads
- Creator variable filters (Age, Niche, Size, Gender, Region, Language) cascade through ALL charts
- 18-creator dataset with useMemo-derived aggregates
- Dual-axis trend charts (Reach vs Spend, Engagement vs Spend)
- Funnel (Impressions → Reach → Engagements → Clicks)
- Auto Insights with 4 action types: Scale / Investigate / Optimize / Pause
- Creator Category Performance + Creator Size Performance with outlier detection (±1.3σ)
- Stats overlays: average line, sum, %, outlier flags

### Campaigns (`/campaigns`)
- Kanban board (by phase) + Grid view
- Service filter chips (All / Influencer / AEO / Ads / Offline)
- Detail panel with tabs: Overview / Brief / Creators / Queries / Chat
- Phase tracker with emoji icons and pulsing active indicator
- Budget pie chart (CSS conic-gradient)
- Independent dual-role approval system (Exec + Management)
- New Requirement modal with guided brief wizard
- Auto-opens specific campaign when navigated from other pages

### Regional Map (`/regional`)
- Real India SVG map (35 states, equirectangular projection)
- Three views: State / Region / Language
- Drill-down with metrics and campaign list
- Campaign popup with cross-page navigation to Campaigns

### Notifications (`/notifications`)
- Unified feed grouped by date (Today / Yesterday / Earlier)
- Filter chips with counts: All / Action Required / Messages / Content / Updates
- Inline quick actions per type (Approve/Reject, Sign Off, Review, Chat)
- Cross-page "Full Context" link to campaign detail

### Billing (`/billing`)
- Hybrid billing: retainer + per-campaign extras
- Default view: Unpaid invoices
- Razorpay payment modal (UPI / Net Banking / Card / Wallet)
- 3-step payment flow (select → processing → success)
- Time filters: 5 presets + Month + Year dropdowns
- Tabs: Invoices / Payment History / Upcoming
- Indian format (₹L/K)

### Settings (`/settings`)
- Sidebar nav: Profile / Team / Notifications / Security / Linked Accounts / Company
- Role-based visibility (Owner sees all, Member sees own profile only)
- 7 notification types × 3 channels toggle grid
- Password change with validation, 2FA toggle, active sessions
- Linked Accounts: Google, UPI, Bank, WhatsApp Business, Slack

---

## Backend Migration Path

This UI uses mock data. When ready to connect:

1. **Phase 1 (Weeks 1-4):** Google Sheets — one sheet per entity
2. **Phase 2 (Month 2-6):** Supabase + PostgreSQL
3. **Phase 3 (6-12mo):** Full backend if needed

Replace mock data in each page's constants with API fetch calls. The `useApp` context can be extended with data-fetching state.

**Integrations planned:** Razorpay (payments), WhatsApp Business API, SendGrid/SES, S3/Supabase Storage, Google OAuth

---

## Tech Stack

- **React 18** (hooks, no class components)
- **Vite 6** (dev server + build)
- **Pure CSS-in-JS** (inline styles, no Tailwind/CSS modules)
- **Sora + Newsreader** (Google Fonts, loaded at runtime)
- **No external UI library** — all components built from scratch

---

## Design Tokens

| Token | Dark | Light |
|-------|------|-------|
| Background | `#050A18` | `#F5F7FA` |
| Surface | `#0A1224` | `#FFFFFF` |
| Accent | `#5B9BFF` | `#3B7FE8` |
| Green | `#4ADE80` | `#16A34A` |
| Red | `#F87171` | `#DC2626` |
| Amber | `#FBBF24` | `#D97706` |
| Pink | `#F472B6` | `#DB2777` |
| Text | `#EAEEF6` | `#1A2238` |
| Muted | `#3D4F6F` | `#9CAABB` |
# 5th-front
