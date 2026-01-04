// Core data types for the Branding Opportunity Finder

export interface ResearchBrief {
  industry: string
  serviceOffering: string
  targetCustomer: string
  competitors: string[] // URLs or names
  geography: string
  pricePoint: 'budget' | 'mid-range' | 'premium' | 'luxury'
  brandTraits: {
    premiumVsAffordable: number // 0-100 (0 = affordable, 100 = premium)
    boldVsMinimal: number // 0-100 (0 = minimal, 100 = bold)
    playfulVsSerious: number // 0-100 (0 = serious, 100 = playful)
  }
  // Derived fields
  keywords?: string[]
  adjacentCategories?: string[]
  customerPains?: string[]
  categoryAlternatives?: string[]
}

export interface CompetitorExtraction {
  url: string
  name: string
  rawHtml: string
  mainText: string
  heroHeadline?: string
  subhead?: string
  ctaText?: string[]
  differentiators?: string[]
  testimonials?: string[]
  trustBadges?: string[]
  claims?: string[]
  pricingLanguage?: string[]
  toneKeywords?: string[]
}

export interface CompetitorStructured {
  name: string
  url: string
  tagline?: string
  primaryOffer: string
  pricingCues?: string
  socialProof?: string[]
  tone: string[]
  differentiators: string[]
  visualCues?: string[]
}

export interface BrandingOpportunity {
  id: string
  category: 'positioning' | 'differentiation' | 'messaging' | 'visual' | 'offer' | 'content'
  title: string
  description: string
  rationale: string
  competitorGap: string
  score: number
  demandSignal: number
  differentiationWhitespace: number
  credibilityFeasibility: number
  speedToImplement: number
  quickWin: boolean
  timeframe: '7-days' | '30-days' | '90-days'
  nextSteps: string[]
}

export interface PositioningMap {
  axes: {
    x: { label: string; min: string; max: string }
    y: { label: string; min: string; max: string }
  }
  points: Array<{
    name: string
    x: number
    y: number
    isUser: boolean
  }>
}

export interface MessagingCheatSheet {
  promise: string
  reasonsToBelieve: string[]
  toneGuidelines: string[]
  objectionHandling: Array<{ objection: string; response: string }>
  proofPoints: string[]
}

export interface VisualDirection {
  styleCues: string[]
  typographyTone: string[]
  colorMood: string[]
  exampleKeywords: string[]
  avoidPatterns: string[]
}

export interface ResearchResults {
  executiveSummary: string
  marketLandscape: string
  competitorSnapshot: CompetitorStructured[]
  opportunities: BrandingOpportunity[]
  positioningMap: PositioningMap
  messagingCheatSheet: MessagingCheatSheet
  visualDirection: VisualDirection
  quickWins: BrandingOpportunity[]
  strategicPlays: BrandingOpportunity[]
  progress?: {
    stage: string
    percentage: number
    message: string
  }
}

export interface PipelineProgress {
  stage: 'normalizing' | 'discovering' | 'parsing' | 'analyzing' | 'complete' | 'error'
  percentage: number
  message: string
  error?: string
}
