# Quick Start Guide

Get the Branding Opportunity Finder running in 3 minutes!

## Prerequisites

- Node.js 18+ installed
- npm installed

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

```bash
# Generate Prisma client
npx prisma generate

# Create database
npx prisma migrate dev --name init
```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## First Research Report

1. Click **"Start New Research"**
2. Fill in the wizard:
   - **Industry:** e.g., "Manuka Honey"
   - **Service Offering:** Describe what you sell and how
   - **Target Customer:** Your ideal customer profile
   - **Geography:** e.g., "United States" or "New York City"
   - **Price Point:** Select your pricing tier
   - **Competitors:** (Optional) Leave blank to auto-discover
   - **Brand Traits:** Use sliders to set positioning preferences
3. Click **"Start Research"**
4. Wait 2-5 minutes for analysis
5. View your comprehensive branding report!

## What You'll Get

- **Executive Summary** - Top findings and opportunities
- **Market Landscape** - Industry analysis
- **Competitor Snapshot** - Detailed competitor analysis table
- **Positioning Map** - Visual 2D chart of market positions
- **Top 10 Opportunities** - Scored and ranked
- **Quick Wins** - 7-day implementation tasks
- **Strategic Plays** - 30-90 day initiatives
- **Messaging Cheat Sheet** - Complete messaging framework
- **Visual Direction** - Style, typography, and color guidance

## Export Options

- **Markdown:** Click "Export Markdown" for a `.md` file
- **PDF:** Click "Print / PDF" and save as PDF

## Troubleshooting

### Database issues

```bash
# Reset database
npx prisma migrate reset

# Regenerate client
npx prisma generate
```

### Build issues

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Port already in use

```bash
# Use a different port
PORT=3001 npm run dev
```

## Need Help?

- Read the full [README.md](README.md)
- Check the [project structure](README.md#-project-structure)
- Review the [pipeline documentation](README.md#-research-pipeline)

---

**Ready to find your branding opportunities? Start now!** 🚀
