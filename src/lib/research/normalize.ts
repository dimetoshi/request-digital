import { ResearchBrief } from '@/types'
import { ResearchBriefInput } from '../validations'

/**
 * Stage A: Input Normalization
 * Takes raw user input and generates derived fields
 */
export async function normalizeInput(input: ResearchBriefInput): Promise<ResearchBrief> {
  // Generate keywords from industry and service offering
  const keywords = generateKeywords(input.industry, input.serviceOffering)

  // Identify adjacent categories
  const adjacentCategories = identifyAdjacentCategories(input.industry)

  // Extract common customer pains from target customer description
  const customerPains = extractCustomerPains(input.targetCustomer)

  // Identify category alternatives
  const categoryAlternatives = identifyCategoryAlternatives(input.industry, input.serviceOffering)

  return {
    ...input,
    keywords,
    adjacentCategories,
    customerPains,
    categoryAlternatives,
  }
}

function generateKeywords(industry: string, serviceOffering: string): string[] {
  const text = `${industry} ${serviceOffering}`.toLowerCase()
  const words = text
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3)

  // Remove common stop words
  const stopWords = new Set(['with', 'from', 'that', 'this', 'have', 'your', 'their', 'about', 'which', 'when', 'where'])
  const keywords = words.filter(word => !stopWords.has(word))

  // Remove duplicates and return top 10
  return Array.from(new Set(keywords)).slice(0, 10)
}

function identifyAdjacentCategories(industry: string): string[] {
  const categoryMap: Record<string, string[]> = {
    'honey': ['organic food', 'natural sweeteners', 'health supplements', 'wellness products'],
    'manuka honey': ['premium honey', 'health supplements', 'natural remedies', 'wellness products'],
    'aircon': ['cooling solutions', 'climate control', 'HVAC', 'portable appliances'],
    'air conditioning': ['cooling solutions', 'climate control', 'HVAC', 'portable appliances'],
    'pet health': ['veterinary services', 'pet care', 'animal wellness', 'pet insurance'],
    'clinic': ['medical services', 'healthcare', 'wellness center', 'diagnostic services'],
    'coffee': ['specialty beverages', 'cafes', 'artisan drinks', 'premium food & drink'],
    'fitness': ['wellness', 'gym', 'personal training', 'health services'],
    'consulting': ['professional services', 'advisory', 'business services', 'coaching'],
  }

  const industryLower = industry.toLowerCase()

  for (const [key, categories] of Object.entries(categoryMap)) {
    if (industryLower.includes(key)) {
      return categories
    }
  }

  // Default categories
  return ['related services', 'complementary products', 'alternative solutions']
}

function extractCustomerPains(targetCustomer: string): string[] {
  const pains: string[] = []
  const text = targetCustomer.toLowerCase()

  // Pattern matching for common pain indicators
  const painPatterns = [
    /struggle(?:s|ing)?\s+(?:with|to)\s+([^,.;]+)/gi,
    /difficulty\s+(?:with|in)\s+([^,.;]+)/gi,
    /frustrated\s+(?:with|by)\s+([^,.;]+)/gi,
    /need(?:s)?\s+(?:help|support|assistance)\s+(?:with|for)\s+([^,.;]+)/gi,
    /looking\s+for\s+([^,.;]+)/gi,
    /want(?:s)?\s+(?:to|a|an)\s+([^,.;]+)/gi,
  ]

  painPatterns.forEach(pattern => {
    const matches = text.matchAll(pattern)
    for (const match of matches) {
      if (match[1]) {
        pains.push(match[1].trim())
      }
    }
  })

  // If no pains extracted, provide defaults based on common patterns
  if (pains.length === 0) {
    return [
      'finding reliable solutions',
      'getting value for money',
      'lack of personalization',
      'poor customer service',
    ]
  }

  return pains.slice(0, 5)
}

function identifyCategoryAlternatives(industry: string, serviceOffering: string): string[] {
  const alternatives: string[] = []
  const industryLower = industry.toLowerCase()
  const offeringLower = serviceOffering.toLowerCase()

  // Industry-specific alternatives
  if (industryLower.includes('honey')) {
    alternatives.push('sugar', 'agave syrup', 'maple syrup', 'artificial sweeteners')
  } else if (industryLower.includes('aircon') || industryLower.includes('cooling')) {
    alternatives.push('fans', 'evaporative coolers', 'window units', 'central AC')
  } else if (industryLower.includes('pet') && industryLower.includes('health')) {
    alternatives.push('home remedies', 'online vet consultations', 'pet pharmacies', 'mobile vets')
  } else if (industryLower.includes('coffee')) {
    alternatives.push('tea', 'energy drinks', 'instant coffee', 'coffee pods')
  } else if (industryLower.includes('fitness') || industryLower.includes('gym')) {
    alternatives.push('home workouts', 'online fitness apps', 'outdoor activities', 'sports clubs')
  }

  // Service delivery alternatives
  if (offeringLower.includes('subscription') || offeringLower.includes('monthly')) {
    alternatives.push('one-time purchase', 'pay-per-use', 'annual plans')
  } else if (offeringLower.includes('online') || offeringLower.includes('digital')) {
    alternatives.push('in-person services', 'hybrid models', 'self-serve platforms')
  }

  return alternatives.length > 0 ? alternatives : ['DIY solutions', 'competitor services', 'alternative categories']
}
