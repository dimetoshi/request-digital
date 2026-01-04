import { generateInsights } from '../analyze'
import { ResearchBrief, CompetitorStructured } from '@/types'

describe('generateInsights', () => {
  const mockBrief: ResearchBrief = {
    industry: 'Pet Health Clinic',
    serviceOffering: 'Mobile veterinary services for busy pet owners',
    targetCustomer: 'Working professionals with pets who struggle to find time for vet visits',
    competitors: [],
    geography: 'Austin, TX',
    pricePoint: 'mid-range',
    brandTraits: {
      premiumVsAffordable: 50,
      boldVsMinimal: 60,
      playfulVsSerious: 70,
    },
    keywords: ['pet', 'health', 'veterinary', 'mobile'],
    adjacentCategories: ['veterinary services', 'pet care'],
    customerPains: ['finding time for vet visits'],
    categoryAlternatives: ['traditional vet clinics'],
  }

  const mockCompetitors: CompetitorStructured[] = [
    {
      name: 'PetCare Pro',
      url: 'https://petcarepro.com',
      primaryOffer: 'Professional veterinary services',
      tone: ['professional', 'trustworthy'],
      differentiators: ['24/7 emergency care', 'Experienced vets'],
      pricingCues: undefined,
    },
    {
      name: 'Vet Express',
      url: 'https://vetexpress.com',
      primaryOffer: 'Quick veterinary consultations',
      tone: ['professional', 'friendly'],
      differentiators: ['Fast service', 'Online booking'],
      pricingCues: 'From $50',
    },
  ]

  it('should generate comprehensive research results', async () => {
    const results = await generateInsights(mockBrief, mockCompetitors)

    expect(results.executiveSummary).toBeDefined()
    expect(results.marketLandscape).toBeDefined()
    expect(results.competitorSnapshot).toHaveLength(2)
    expect(results.opportunities.length).toBeGreaterThan(0)
    expect(results.positioningMap).toBeDefined()
    expect(results.messagingCheatSheet).toBeDefined()
    expect(results.visualDirection).toBeDefined()
  })

  it('should generate scored opportunities', async () => {
    const results = await generateInsights(mockBrief, mockCompetitors)

    expect(results.opportunities.length).toBeGreaterThan(0)

    results.opportunities.forEach(opp => {
      expect(opp.score).toBeGreaterThanOrEqual(0)
      expect(opp.score).toBeLessThanOrEqual(100)
      expect(opp.demandSignal).toBeDefined()
      expect(opp.differentiationWhitespace).toBeDefined()
      expect(opp.credibilityFeasibility).toBeDefined()
      expect(opp.speedToImplement).toBeDefined()
    })
  })

  it('should sort opportunities by score', async () => {
    const results = await generateInsights(mockBrief, mockCompetitors)

    for (let i = 0; i < results.opportunities.length - 1; i++) {
      expect(results.opportunities[i].score).toBeGreaterThanOrEqual(
        results.opportunities[i + 1].score
      )
    }
  })

  it('should separate quick wins and strategic plays', async () => {
    const results = await generateInsights(mockBrief, mockCompetitors)

    expect(results.quickWins).toBeDefined()
    expect(results.strategicPlays).toBeDefined()

    results.quickWins.forEach(win => {
      expect(win.timeframe).toBe('7-days')
    })

    results.strategicPlays.forEach(play => {
      expect(['30-days', '90-days']).toContain(play.timeframe)
    })
  })

  it('should generate positioning map with user brand', async () => {
    const results = await generateInsights(mockBrief, mockCompetitors)

    expect(results.positioningMap.points.length).toBe(mockCompetitors.length + 1)

    const userPoint = results.positioningMap.points.find(p => p.isUser)
    expect(userPoint).toBeDefined()
    expect(userPoint!.name).toBe('Your Brand')
  })

  it('should generate actionable messaging cheat sheet', async () => {
    const results = await generateInsights(mockBrief, mockCompetitors)

    expect(results.messagingCheatSheet.promise).toBeDefined()
    expect(results.messagingCheatSheet.reasonsToBelieve.length).toBeGreaterThan(0)
    expect(results.messagingCheatSheet.toneGuidelines.length).toBeGreaterThan(0)
    expect(results.messagingCheatSheet.objectionHandling.length).toBeGreaterThan(0)
    expect(results.messagingCheatSheet.proofPoints.length).toBeGreaterThan(0)
  })

  it('should generate visual direction based on brand traits', async () => {
    const results = await generateInsights(mockBrief, mockCompetitors)

    expect(results.visualDirection.styleCues.length).toBeGreaterThan(0)
    expect(results.visualDirection.typographyTone.length).toBeGreaterThan(0)
    expect(results.visualDirection.colorMood.length).toBeGreaterThan(0)
    expect(results.visualDirection.exampleKeywords.length).toBeGreaterThan(0)
    expect(results.visualDirection.avoidPatterns.length).toBeGreaterThan(0)
  })

  it('should include category-specific opportunities', async () => {
    const results = await generateInsights(mockBrief, mockCompetitors)

    const categories = results.opportunities.map(o => o.category)

    // Should have opportunities across multiple categories
    expect(new Set(categories).size).toBeGreaterThan(1)
  })
})
