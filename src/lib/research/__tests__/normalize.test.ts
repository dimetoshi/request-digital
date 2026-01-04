import { normalizeInput } from '../normalize'
import { ResearchBriefInput } from '../../validations'

describe('normalizeInput', () => {
  const baseInput: ResearchBriefInput = {
    industry: 'Manuka Honey',
    serviceOffering: 'Premium Manuka honey from New Zealand with verified UMF ratings',
    targetCustomer: 'Health-conscious consumers who struggle with finding authentic natural remedies',
    competitors: [],
    geography: 'United States',
    pricePoint: 'premium',
    brandTraits: {
      premiumVsAffordable: 75,
      boldVsMinimal: 40,
      playfulVsSerious: 30,
    },
  }

  it('should generate keywords from industry and service offering', async () => {
    const result = await normalizeInput(baseInput)

    expect(result.keywords).toBeDefined()
    expect(result.keywords!.length).toBeGreaterThan(0)
    expect(result.keywords).toContain('manuka')
    expect(result.keywords).toContain('honey')
  })

  it('should identify adjacent categories for known industries', async () => {
    const result = await normalizeInput(baseInput)

    expect(result.adjacentCategories).toBeDefined()
    expect(result.adjacentCategories!.length).toBeGreaterThan(0)
    // Honey should map to health-related categories
    expect(result.adjacentCategories).toEqual(
      expect.arrayContaining(['premium honey', 'health supplements'])
    )
  })

  it('should extract customer pains from description', async () => {
    const result = await normalizeInput(baseInput)

    expect(result.customerPains).toBeDefined()
    expect(result.customerPains!.length).toBeGreaterThan(0)
    expect(result.customerPains).toEqual(
      expect.arrayContaining(['finding authentic natural remedies'])
    )
  })

  it('should identify category alternatives', async () => {
    const result = await normalizeInput(baseInput)

    expect(result.categoryAlternatives).toBeDefined()
    expect(result.categoryAlternatives!.length).toBeGreaterThan(0)
    // Honey alternatives should include other sweeteners
    expect(result.categoryAlternatives).toEqual(
      expect.arrayContaining(['sugar', 'agave syrup'])
    )
  })

  it('should preserve original input fields', async () => {
    const result = await normalizeInput(baseInput)

    expect(result.industry).toBe(baseInput.industry)
    expect(result.serviceOffering).toBe(baseInput.serviceOffering)
    expect(result.targetCustomer).toBe(baseInput.targetCustomer)
    expect(result.geography).toBe(baseInput.geography)
  })
})
