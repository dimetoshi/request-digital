# Branding Opportunity Finder

A production-ready web application that conducts AI-powered market research to identify branding opportunities, positioning gaps, and messaging angles for your business.

## 🎯 What It Does

Given your industry, service offering, target customer, and geography, the Branding Opportunity Finder:

- **Discovers & Analyzes Competitors** - Automatically finds competitors in your market or analyzes the ones you provide
- **Identifies Positioning Gaps** - Finds underserved segments and unique category positions
- **Scores Opportunities** - Ranks branding opportunities across positioning, messaging, visual identity, and content
- **Provides Actionable Insights** - Delivers quick wins (7 days) and strategic plays (30-90 days) with clear next steps
- **Generates Visual Direction** - Suggests style cues, typography, and color directions based on your brand traits
- **Creates Messaging Framework** - Builds a complete messaging cheat sheet with objection handling

## 🏗️ Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Database:** Prisma + SQLite
- **Validation:** Zod
- **Server Actions:** React Server Actions
- **Testing:** Jest + React Testing Library

## 📋 Prerequisites

- Node.js 18+
- npm or yarn

## 🚀 Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd branding-opportunity-finder
npm install
```

### 2. Set Up Environment

```bash
cp .env.example .env
```

The default `.env` file is already configured for local development with SQLite.

### 3. Initialize Database

```bash
# Generate Prisma client
npx prisma generate

# Create and migrate database
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

### Creating a New Research Report

1. Click **"Start New Research"** on the homepage
2. Complete the 4-step wizard:
   - **Step 1:** Industry & Service Offering
   - **Step 2:** Target Customer & Geography
   - **Step 3:** Competitors (optional - we'll discover them for you)
   - **Step 4:** Brand Traits (sliders for positioning preferences)
3. Submit and wait for analysis (2-5 minutes)
4. View your comprehensive branding report

### Understanding the Report

Your report includes:

- **Executive Summary** - High-level findings and top opportunity
- **Market Landscape** - Industry tone, pricing transparency, differentiation analysis
- **Competitor Snapshot** - Sortable table of analyzed competitors
- **Positioning Map** - 2D visualization showing your position vs. competitors
- **Top Opportunities** - Scored opportunities with detailed rationale
- **Quick Wins** - 7-day implementations for immediate impact
- **Strategic Plays** - 30-90 day initiatives for long-term positioning
- **Messaging Cheat Sheet** - Promise, tone, objection handling, proof points
- **Visual Direction** - Style cues, typography, colors, and patterns to avoid

### Exporting Reports

- **Markdown:** Click "Export Markdown" to download a `.md` file
- **PDF:** Click "Print / PDF" to use your browser's print-to-PDF feature

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 🗂️ Project Structure

```
branding-opportunity-finder/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── actions/
│   │   └── research.ts        # Server actions for reports
│   ├── app/
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Landing page
│   │   ├── wizard/
│   │   │   └── page.tsx       # Multi-step form
│   │   └── reports/[id]/
│   │       └── page.tsx       # Report display
│   ├── components/
│   │   ├── CompetitorTable.tsx
│   │   ├── OpportunityCard.tsx
│   │   ├── PositioningMapChart.tsx
│   │   ├── ProgressView.tsx
│   │   └── ReportView.tsx
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client
│   │   ├── validations.ts     # Zod schemas
│   │   └── research/
│   │       ├── normalize.ts   # Input normalization
│   │       ├── discover.ts    # Competitor discovery
│   │       ├── parse.ts       # Page parsing
│   │       ├── analyze.ts     # Insight generation
│   │       └── pipeline.ts    # Pipeline orchestrator
│   └── types/
│       └── index.ts           # TypeScript types
├── .env                       # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Configuration

### Environment Variables

```bash
# Database
DATABASE_URL="file:./dev.db"

# Optional: Search API (for enhanced competitor discovery)
# SEARCH_API_KEY="your-key-here"
```

### Database Management

```bash
# View data in Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset

# Generate Prisma client after schema changes
npx prisma generate
```

## 📊 Research Pipeline

The application uses a multi-stage research pipeline:

### Stage A: Input Normalization
- Sanitizes user inputs
- Generates keywords from industry/offering
- Identifies adjacent categories
- Extracts customer pain points
- Maps category alternatives

### Stage B: Competitor Discovery
- Uses web search (DuckDuckGo HTML) if competitors not provided
- Discovers 8-12 relevant competitors
- Filters out non-commercial sites
- Deduplicates results

### Stage C: Page Parsing
- Fetches competitor websites
- Extracts hero headlines, CTAs, differentiators
- Identifies testimonials, trust badges, pricing
- Determines tone and messaging patterns
- Structures data for analysis

### Stage D: Insight Generation
- Generates opportunities across 6 categories:
  - **Positioning:** Niche categories, underserved segments
  - **Differentiation:** Guarantees, social proof, transparency
  - **Messaging:** Tone, benefit-focus, clarity
  - **Visual:** Design distinctiveness, personality
  - **Offer:** Packaging, trials, pricing structure
  - **Content:** Educational content, pain-point targeting
- Scores each opportunity using:
  - Demand Signal (market need)
  - Differentiation Whitespace (competitor gap)
  - Credibility Feasibility (can you deliver?)
  - Speed to Implement (time to execute)
- Calculates final score: (demand + whitespace + feasibility + speed) / 4

## 🎨 Opportunity Scoring

Each opportunity is scored 0-100 based on four factors:

- **Demand Signal** - How much the market needs this
- **Whitespace** - How different from competitors
- **Feasibility** - How credible/achievable for you
- **Speed** - How quickly you can implement

Higher scores = better opportunities. Quick wins (7-day) are prioritized for immediate impact.

## 🚧 Known Limitations

- **Competitor Discovery:** Uses HTML-based search; rate-limited by DuckDuckGo
- **Page Parsing:** Works best with standard marketing sites; may struggle with JS-heavy SPAs
- **Background Jobs:** Currently runs in-process; for production, use a job queue (Bull, BullMQ)
- **Caching:** No caching of competitor data; re-fetches on each analysis

## 🔮 Future Enhancements

- [ ] Integration with search APIs (Brave, SerpAPI) for better discovery
- [ ] Visual screenshot analysis for design insights
- [ ] Social media sentiment analysis
- [ ] Competitor pricing extraction and comparison
- [ ] PDF export with custom branding
- [ ] Scheduled re-analysis and change tracking
- [ ] Team collaboration features
- [ ] AI-powered opportunity deep-dives

## 🛠️ Production Deployment

### Recommended Stack

- **Hosting:** Vercel, Railway, or AWS
- **Database:** PostgreSQL (update `schema.prisma` datasource)
- **Job Queue:** BullMQ with Redis for background processing
- **Monitoring:** Sentry for error tracking
- **Analytics:** PostHog or Mixpanel

### Deployment Steps

1. Update database to PostgreSQL:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Set up environment variables in your hosting platform

3. Run migrations:

```bash
npx prisma migrate deploy
```

4. Deploy:

```bash
npm run build
```

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## ⚠️ Disclaimer

This tool is for research and strategic planning purposes. Always verify findings with additional market research and domain expertise. Automated web scraping should respect robots.txt and rate limits.

---

**Built with ❤️ using Next.js, TypeScript, and AI-powered analysis**
