import {
  ResearchBrief,
  CompetitorStructured,
  BrandingOpportunity,
  PositioningMap,
  MessagingCheatSheet,
  VisualDirection,
  ResearchResults,
} from '@/types'

/**
 * Stage D: Insight Generation
 * Analyzes competitor data and generates branding opportunities
 */

export async function generateInsights(
  brief: ResearchBrief,
  competitors: CompetitorStructured[]
): Promise<ResearchResults> {
  // Generate opportunities across all categories
  const opportunities = await generateOpportunities(brief, competitors)

  // Sort by score
  const sortedOpportunities = opportunities.sort((a, b) => b.score - a.score)

  // Split into quick wins and strategic plays
  const quickWins = sortedOpportunities.filter(opp => opp.timeframe === '7-days').slice(0, 5)
  const strategicPlays = sortedOpportunities
    .filter(opp => opp.timeframe !== '7-days')
    .slice(0, 5)

  // Generate other insights
  const executiveSummary = generateExecutiveSummary(brief, competitors, opportunities)
  const marketLandscape = generateMarketLandscape(brief, competitors)
  const positioningMap = generatePositioningMap(brief, competitors)
  const messagingCheatSheet = generateMessagingCheatSheet(brief, competitors, opportunities)
  const visualDirection = generateVisualDirection(brief, competitors)

  return {
    executiveSummary,
    marketLandscape,
    competitorSnapshot: competitors,
    opportunities: sortedOpportunities.slice(0, 10),
    positioningMap,
    messagingCheatSheet,
    visualDirection,
    quickWins,
    strategicPlays,
  }
}

async function generateOpportunities(
  brief: ResearchBrief,
  competitors: CompetitorStructured[]
): Promise<BrandingOpportunity[]> {
  const opportunities: BrandingOpportunity[] = []

  // Positioning opportunities
  opportunities.push(...generatePositioningOpportunities(brief, competitors))

  // Differentiation opportunities
  opportunities.push(...generateDifferentiationOpportunities(brief, competitors))

  // Messaging opportunities
  opportunities.push(...generateMessagingOpportunities(brief, competitors))

  // Visual opportunities
  opportunities.push(...generateVisualOpportunities(brief, competitors))

  // Offer packaging opportunities
  opportunities.push(...generateOfferOpportunities(brief, competitors))

  // Content opportunities
  opportunities.push(...generateContentOpportunities(brief, competitors))

  return opportunities
}

function generatePositioningOpportunities(
  brief: ResearchBrief,
  competitors: CompetitorStructured[]
): BrandingOpportunity[] {
  const opportunities: BrandingOpportunity[] = []

  // Analyze category definitions
  const categoryDefinitions = competitors
    .map(c => c.primaryOffer.toLowerCase())
    .join(' ')

  // Check if anyone owns a unique category
  const hasNicheCategory = competitors.some(c =>
    c.primaryOffer.toLowerCase().includes('specialist') ||
    c.primaryOffer.toLowerCase().includes('expert')
  )

  if (!hasNicheCategory) {
    opportunities.push({
      id: 'pos-1',
      category: 'positioning',
      title: 'Own a niche category position',
      description: `Position as "The ${brief.industry} Specialist for ${brief.targetCustomer}"`,
      rationale: 'No competitors explicitly claim specialist positioning in this niche',
      competitorGap: 'Most competitors use generic positioning without niche focus',
      ...scoreOpportunity(85, 90, 80, 95),
      quickWin: false,
      timeframe: '30-days',
      nextSteps: [
        'Update website hero headline to claim specialist position',
        'Create "Why Specialist Matters" content',
        'Add specialist credentials and case studies',
      ],
    })
  }

  // Check for underserved segments
  const targetLower = brief.targetCustomer.toLowerCase()
  const underservedSegment = !competitors.some(c =>
    c.primaryOffer.toLowerCase().includes(targetLower.slice(0, 20))
  )

  if (underservedSegment) {
    opportunities.push({
      id: 'pos-2',
      category: 'positioning',
      title: 'Target underserved customer segment',
      description: `Explicitly position for ${brief.targetCustomer}`,
      rationale: 'Competitors use broad positioning; none specifically address this ICP',
      competitorGap: 'Generic "everyone" positioning vs. targeted approach',
      ...scoreOpportunity(80, 95, 75, 70),
      quickWin: false,
      timeframe: '30-days',
      nextSteps: [
        'Rewrite all messaging to speak directly to this ICP',
        'Create customer persona-specific landing pages',
        'Develop case studies from this segment',
      ],
    })
  }

  return opportunities
}

function generateDifferentiationOpportunities(
  brief: ResearchBrief,
  competitors: CompetitorStructured[]
): BrandingOpportunity[] {
  const opportunities: BrandingOpportunity[] = []

  // Check for guarantee gaps
  const hasGuarantee = competitors.some(c =>
    c.differentiators.some(d =>
      d.toLowerCase().includes('guarantee') ||
      d.toLowerCase().includes('money back')
    )
  )

  if (!hasGuarantee) {
    opportunities.push({
      id: 'diff-1',
      category: 'differentiation',
      title: 'Introduce a bold guarantee',
      description: 'Create an industry-leading satisfaction guarantee that competitors don\'t offer',
      rationale: 'None of the analyzed competitors prominently feature guarantees',
      competitorGap: 'No competitors de-risk the purchase decision',
      ...scoreOpportunity(70, 85, 90, 90),
      quickWin: true,
      timeframe: '7-days',
      nextSteps: [
        'Design guarantee terms (e.g., 30-day money back, satisfaction guaranteed)',
        'Create guarantee badge/seal for website',
        'Add guarantee messaging to all CTAs',
      ],
    })
  }

  // Check for social proof gaps
  const hasSocialProof = competitors.filter(c => c.socialProof && c.socialProof.length > 0).length
  const socialProofPercentage = (hasSocialProof / competitors.length) * 100

  if (socialProofPercentage < 50) {
    opportunities.push({
      id: 'diff-2',
      category: 'differentiation',
      title: 'Leverage customer testimonials prominently',
      description: 'Feature customer success stories and testimonials more prominently than competitors',
      rationale: `Only ${Math.round(socialProofPercentage)}% of competitors show testimonials`,
      competitorGap: 'Most competitors lack social proof on their homepage',
      ...scoreOpportunity(75, 70, 95, 95),
      quickWin: true,
      timeframe: '7-days',
      nextSteps: [
        'Collect 5-10 customer testimonials',
        'Add testimonial carousel to homepage',
        'Create video testimonials for credibility',
      ],
    })
  }

  // Check for transparency opportunities
  const hasTransparentPricing = competitors.some(c =>
    c.pricingCues && c.pricingCues.includes('$')
  )

  if (!hasTransparentPricing) {
    opportunities.push({
      id: 'diff-3',
      category: 'differentiation',
      title: 'Transparent pricing (vs. "Contact Us")',
      description: 'Display clear pricing while competitors hide behind "Request Quote"',
      rationale: 'No competitors show pricing upfront',
      competitorGap: 'Competitors create friction with hidden pricing',
      ...scoreOpportunity(85, 90, 70, 85),
      quickWin: false,
      timeframe: '30-days',
      nextSteps: [
        'Create simple pricing page with clear tiers',
        'Add "No hidden fees" messaging',
        'Build pricing calculator if applicable',
      ],
    })
  }

  return opportunities
}

function generateMessagingOpportunities(
  brief: ResearchBrief,
  competitors: CompetitorStructured[]
): BrandingOpportunity[] {
  const opportunities: BrandingOpportunity[] = []

  // Analyze tone distribution
  const toneMap = new Map<string, number>()
  competitors.forEach(c => {
    c.tone.forEach(t => {
      toneMap.set(t, (toneMap.get(t) || 0) + 1)
    })
  })

  const dominantTone = Array.from(toneMap.entries()).sort((a, b) => b[1] - a[1])[0]?.[0]

  // If everyone is professional, be friendly
  if (dominantTone === 'professional') {
    opportunities.push({
      id: 'msg-1',
      category: 'messaging',
      title: 'Adopt a more human, conversational tone',
      description: 'Stand out with friendly, approachable messaging while competitors stay formal',
      rationale: 'All competitors use corporate, professional tone',
      competitorGap: 'Industry sounds robotic and impersonal',
      ...scoreOpportunity(80, 85, 85, 90),
      quickWin: true,
      timeframe: '7-days',
      nextSteps: [
        'Rewrite homepage copy in conversational voice',
        'Use "you" and "we" instead of third person',
        'Add personality to CTAs (e.g., "Let\'s do this" vs "Submit")',
      ],
    })
  }

  // Check for benefit-oriented messaging
  const featureFocused = competitors.filter(c =>
    c.differentiators.some(d =>
      d.toLowerCase().includes('feature') ||
      d.toLowerCase().includes('includes') ||
      d.toLowerCase().includes('with')
    )
  ).length

  if (featureFocused > competitors.length / 2) {
    opportunities.push({
      id: 'msg-2',
      category: 'messaging',
      title: 'Lead with benefits, not features',
      description: 'Flip messaging to focus on customer outcomes rather than product features',
      rationale: 'Most competitors list features without connecting to benefits',
      competitorGap: 'Feature-focused messaging vs. outcome-focused',
      ...scoreOpportunity(75, 80, 90, 75),
      quickWin: false,
      timeframe: '30-days',
      nextSteps: [
        'Audit all copy for feature→benefit conversion',
        'Use formula: "So you can [benefit]" after each feature',
        'Create benefit-driven headlines',
      ],
    })
  }

  return opportunities
}

function generateVisualOpportunities(
  brief: ResearchBrief,
  competitors: CompetitorStructured[]
): BrandingOpportunity[] {
  const opportunities: BrandingOpportunity[] = []

  // Based on brand traits, suggest visual differentiators
  const { brandTraits } = brief

  if (brandTraits.boldVsMinimal > 60 && competitors.length > 0) {
    opportunities.push({
      id: 'vis-1',
      category: 'visual',
      title: 'Adopt bold, distinctive visual identity',
      description: 'Use vibrant colors and bold typography while competitors play it safe',
      rationale: 'Your brand trait preference is bold; competitors likely use safe, corporate aesthetics',
      competitorGap: 'Industry standard is muted, conservative design',
      ...scoreOpportunity(70, 90, 75, 60),
      quickWin: false,
      timeframe: '90-days',
      nextSteps: [
        'Develop bold color palette (avoid industry blues/grays)',
        'Choose distinctive display typography',
        'Create visual brand guidelines',
      ],
    })
  }

  if (brandTraits.playfulVsSerious > 60) {
    opportunities.push({
      id: 'vis-2',
      category: 'visual',
      title: 'Inject personality through illustrations/icons',
      description: 'Use custom illustrations while competitors rely on stock photos',
      rationale: 'Playful brand traits can differentiate in serious industry',
      competitorGap: 'Generic stock photography across all competitors',
      ...scoreOpportunity(65, 85, 70, 50),
      quickWin: false,
      timeframe: '90-days',
      nextSteps: [
        'Commission custom illustration set',
        'Replace stock photos with branded visuals',
        'Create consistent icon system',
      ],
    })
  }

  return opportunities
}

function generateOfferOpportunities(
  brief: ResearchBrief,
  competitors: CompetitorStructured[]
): BrandingOpportunity[] {
  const opportunities: BrandingOpportunity[] = []

  // Check for offer packaging
  const hasTieredPricing = competitors.some(c =>
    c.pricingCues && (
      c.pricingCues.toLowerCase().includes('plan') ||
      c.pricingCues.toLowerCase().includes('tier')
    )
  )

  if (!hasTieredPricing) {
    opportunities.push({
      id: 'offer-1',
      category: 'offer',
      title: 'Create tiered package options',
      description: 'Offer Good/Better/Best packages while competitors offer one-size-fits-all',
      rationale: 'No competitors show tiered pricing structures',
      competitorGap: 'Single offering vs. choice architecture',
      ...scoreOpportunity(80, 85, 80, 60),
      quickWin: false,
      timeframe: '30-days',
      nextSteps: [
        'Design 3-tier package structure',
        'Name tiers memorably (not Bronze/Silver/Gold)',
        'Add anchor pricing to drive conversions',
      ],
    })
  }

  // Check for trial/sample offers
  const hasTrialOffer = competitors.some(c =>
    c.primaryOffer.toLowerCase().includes('free') ||
    c.primaryOffer.toLowerCase().includes('trial')
  )

  if (!hasTrialOffer) {
    opportunities.push({
      id: 'offer-2',
      category: 'offer',
      title: 'Introduce free trial or sample',
      description: 'Reduce barrier to entry with trial offer',
      rationale: 'No competitors offer risk-free trials',
      competitorGap: 'High friction purchase vs. try-before-buy',
      ...scoreOpportunity(85, 80, 85, 70),
      quickWin: false,
      timeframe: '30-days',
      nextSteps: [
        'Design trial offer structure',
        'Create trial landing page',
        'Set up trial→paid conversion funnel',
      ],
    })
  }

  return opportunities
}

function generateContentOpportunities(
  brief: ResearchBrief,
  competitors: CompetitorStructured[]
): BrandingOpportunity[] {
  const opportunities: BrandingOpportunity[] = []

  // Check for educational content
  opportunities.push({
    id: 'content-1',
    category: 'content',
    title: 'Create educational content hub',
    description: `Build authority with "Ultimate Guide to ${brief.industry}"`,
    rationale: 'Educational content builds trust and drives organic traffic',
    competitorGap: 'Competitors focus on selling, not educating',
    ...scoreOpportunity(75, 70, 80, 65),
    quickWin: false,
    timeframe: '30-days',
    nextSteps: [
      'Identify top 10 customer questions',
      'Create comprehensive guide/FAQ',
      'Optimize for SEO',
    ],
  })

  // Customer pains content
  if (brief.customerPains && brief.customerPains.length > 0) {
    opportunities.push({
      id: 'content-2',
      category: 'content',
      title: 'Address customer pain points explicitly',
      description: `Create content around: ${brief.customerPains.slice(0, 2).join(', ')}`,
      rationale: 'Your ICP has specific pains; address them directly',
      competitorGap: 'Competitors don\'t speak to these specific pain points',
      ...scoreOpportunity(80, 85, 90, 80),
      quickWin: true,
      timeframe: '7-days',
      nextSteps: [
        'Write pain-point-driven landing page sections',
        'Create "Before/After" content',
        'Develop pain→solution messaging',
      ],
    })
  }

  return opportunities
}

function scoreOpportunity(
  demandSignal: number,
  differentiationWhitespace: number,
  credibilityFeasibility: number,
  speedToImplement: number
): Pick<BrandingOpportunity, 'score' | 'demandSignal' | 'differentiationWhitespace' | 'credibilityFeasibility' | 'speedToImplement'> {
  const score = (demandSignal + differentiationWhitespace + credibilityFeasibility + speedToImplement) / 4

  return {
    score: Math.round(score),
    demandSignal,
    differentiationWhitespace,
    credibilityFeasibility,
    speedToImplement,
  }
}

function generateExecutiveSummary(
  brief: ResearchBrief,
  competitors: CompetitorStructured[],
  opportunities: BrandingOpportunity[]
): string {
  const topOpportunity = opportunities[0]

  return `This research analyzed ${competitors.length} competitors in the ${brief.industry} space targeting ${brief.geography}.

KEY FINDING: ${topOpportunity?.title || 'Multiple opportunities identified'} (Score: ${topOpportunity?.score || 'N/A'}/100)

The competitive landscape shows ${competitors.length} players with varying positioning strategies. Most competitors share common patterns in messaging, visual identity, and offer structure—creating multiple opportunities for differentiation.

The highest-impact opportunity is ${topOpportunity?.category || 'differentiation'}-focused: ${topOpportunity?.description || 'Multiple opportunities exist across positioning, messaging, and visual identity.'} This represents significant whitespace in the market.

${brief.pricePoint === 'premium' || brief.pricePoint === 'luxury' ? 'Your premium positioning enables quality-focused messaging and visual distinctiveness.' : 'Your price point creates opportunities to emphasize value and transparency.'}

The recommended approach balances quick wins (7-day implementations) with strategic plays (30-90 days) to build a distinctive brand position.`
}

function generateMarketLandscape(
  brief: ResearchBrief,
  competitors: CompetitorStructured[]
): string {
  const toneMap = new Map<string, number>()
  competitors.forEach(c => {
    c.tone.forEach(t => {
      toneMap.set(t, (toneMap.get(t) || 0) + 1)
    })
  })

  const dominantTones = Array.from(toneMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tone]) => tone)

  const hasPricing = competitors.filter(c => c.pricingCues && c.pricingCues.includes('$')).length
  const pricingTransparency = Math.round((hasPricing / competitors.length) * 100)

  return `Market Characteristics:

TONE: The competitive set skews toward ${dominantTones.join(', ')} messaging. This creates opportunities for differentiation through tone and personality.

PRICING: ${pricingTransparency}% of competitors show transparent pricing. ${pricingTransparency < 50 ? 'Most hide pricing behind "Contact Us," creating friction.' : 'Pricing transparency is becoming table stakes.'}

DIFFERENTIATION: Most competitors compete on similar attributes. Few have carved out unique positioning or owned specific customer segments.

CATEGORY ALTERNATIVES: Customers also consider: ${brief.categoryAlternatives?.join(', ') || 'alternative solutions'}.

CUSTOMER PAIN POINTS: Your ICP struggles with: ${brief.customerPains?.join(', ') || 'common industry challenges'}.`
}

function generatePositioningMap(
  brief: ResearchBrief,
  competitors: CompetitorStructured[]
): PositioningMap {
  // Create a 2D positioning map
  // X-axis: Price (affordable → premium)
  // Y-axis: Approach (traditional → innovative)

  const points = competitors.map((c, index) => {
    // Estimate position based on available data
    const hasPremiumLanguage = c.tone.includes('luxurious') || c.primaryOffer.toLowerCase().includes('premium')
    const hasInnovativeLanguage = c.tone.includes('innovative') || c.primaryOffer.toLowerCase().includes('innovative')

    return {
      name: c.name,
      x: hasPremiumLanguage ? 75 : 40 + (index % 3) * 20,
      y: hasInnovativeLanguage ? 70 : 35 + (index % 3) * 15,
      isUser: false,
    }
  })

  // Add user's brand position based on their traits
  const userX = brief.brandTraits.premiumVsAffordable
  const userY = brief.brandTraits.boldVsMinimal

  points.push({
    name: 'Your Brand',
    x: userX,
    y: userY,
    isUser: true,
  })

  return {
    axes: {
      x: { label: 'Price Positioning', min: 'Affordable', max: 'Premium' },
      y: { label: 'Brand Approach', min: 'Traditional', max: 'Innovative' },
    },
    points,
  }
}

function generateMessagingCheatSheet(
  brief: ResearchBrief,
  competitors: CompetitorStructured[],
  opportunities: BrandingOpportunity[]
): MessagingCheatSheet {
  const messagingOpps = opportunities.filter(o => o.category === 'messaging')

  return {
    promise: `${brief.industry} that actually ${brief.customerPains?.[0] || 'solves your problem'}`,
    reasonsToBelieve: [
      `Specialized for ${brief.targetCustomer}`,
      'Transparent pricing and guarantees',
      'Proven results from [X] customers',
      `${brief.geography}-based, locally focused`,
    ],
    toneGuidelines: [
      messagingOpps[0]?.description || 'Speak directly to customer pain points',
      'Be specific, not generic',
      'Show, don\'t tell (use proof points)',
      'Human, conversational tone',
    ],
    objectionHandling: [
      {
        objection: 'Too expensive',
        response: 'Highlight ROI and guarantee; compare cost of NOT solving the problem',
      },
      {
        objection: 'Not sure it will work',
        response: 'Offer trial, testimonials, case studies; de-risk with guarantee',
      },
      {
        objection: 'Already have a solution',
        response: 'Position as complement or upgrade; show specific advantages',
      },
    ],
    proofPoints: [
      'Customer testimonials and case studies',
      'Transparent results and metrics',
      'Industry certifications or credentials',
      'Years in business / customers served',
    ],
  }
}

function generateVisualDirection(
  brief: ResearchBrief,
  competitors: CompetitorStructured[]
): VisualDirection {
  const { brandTraits } = brief

  const styleCues: string[] = []
  const typographyTone: string[] = []
  const colorMood: string[] = []

  // Style cues based on brand traits
  if (brandTraits.boldVsMinimal > 60) {
    styleCues.push('High contrast', 'Large typography', 'Statement visuals', 'Asymmetric layouts')
  } else {
    styleCues.push('Clean whitespace', 'Grid-based layouts', 'Subtle accents', 'Minimal decoration')
  }

  if (brandTraits.playfulVsSerious > 60) {
    styleCues.push('Rounded corners', 'Illustrations', 'Animated elements', 'Friendly icons')
  } else {
    styleCues.push('Geometric shapes', 'Photography', 'Structured layouts', 'Professional iconography')
  }

  // Typography
  if (brandTraits.boldVsMinimal > 60) {
    typographyTone.push('Display serif or bold sans', 'High weight contrast', 'Expressive headlines')
  } else {
    typographyTone.push('Clean sans-serif', 'Subtle hierarchy', 'Legible body copy')
  }

  if (brandTraits.premiumVsAffordable > 60) {
    typographyTone.push('Sophisticated letterforms', 'Generous spacing', 'Refined details')
  } else {
    typographyTone.push('Straightforward fonts', 'Functional hierarchy', 'Clear readability')
  }

  // Colors
  if (brandTraits.premiumVsAffordable > 60) {
    colorMood.push('Deep, rich tones', 'Metallic accents', 'Sophisticated palette', 'Low saturation')
  } else {
    colorMood.push('Bright, accessible colors', 'Clear differentiation', 'Energetic palette')
  }

  if (brandTraits.playfulVsSerious > 60) {
    colorMood.push('Vibrant hues', 'Multiple accent colors', 'Warm tones')
  } else {
    colorMood.push('Muted palette', 'Limited color range', 'Cool or neutral tones')
  }

  return {
    styleCues,
    typographyTone,
    colorMood,
    exampleKeywords: [
      brandTraits.boldVsMinimal > 60 ? 'Bold' : 'Minimal',
      brandTraits.playfulVsSerious > 60 ? 'Playful' : 'Serious',
      brandTraits.premiumVsAffordable > 60 ? 'Premium' : 'Accessible',
      'Distinctive',
      'Modern',
    ],
    avoidPatterns: [
      'Generic stock photography',
      'Overused color combinations (blue + orange)',
      'Corporate clip art',
      'Cliché industry imagery',
    ],
  }
}
