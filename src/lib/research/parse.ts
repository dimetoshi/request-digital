import * as cheerio from 'cheerio'
import { CompetitorExtraction, CompetitorStructured } from '@/types'

/**
 * Stage C: Page Parsing
 * Fetches and parses competitor websites to extract structured data
 */

export async function parseCompetitorPage(url: string, name: string): Promise<{
  extracted: CompetitorExtraction
  structured: CompetitorStructured
}> {
  try {
    // Fetch the page
    const html = await fetchPage(url)

    // Extract raw data
    const extracted = extractFromHtml(html, url, name)

    // Structure the data
    const structured = structureData(extracted)

    return { extracted, structured }
  } catch (error) {
    console.error(`Failed to parse ${url}:`, error)

    // Return minimal data
    return {
      extracted: {
        url,
        name,
        rawHtml: '',
        mainText: '',
      },
      structured: {
        name,
        url,
        primaryOffer: 'Unknown',
        tone: [],
        differentiators: [],
      },
    }
  }
}

async function fetchPage(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    },
    signal: AbortSignal.timeout(10000), // 10 second timeout
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  return await response.text()
}

function extractFromHtml(html: string, url: string, name: string): CompetitorExtraction {
  const $ = cheerio.load(html)

  // Remove script, style, nav, footer
  $('script, style, nav, footer, .nav, .footer, .menu, #menu').remove()

  // Extract main text
  const mainText = $('body').text().replace(/\s+/g, ' ').trim()

  // Extract hero section
  const heroHeadline = extractHeroHeadline($)
  const subhead = extractSubhead($)

  // Extract CTAs
  const ctaText = extractCTAs($)

  // Extract differentiators
  const differentiators = extractDifferentiators($)

  // Extract testimonials
  const testimonials = extractTestimonials($)

  // Extract trust badges
  const trustBadges = extractTrustBadges($)

  // Extract claims
  const claims = extractClaims($)

  // Extract pricing language
  const pricingLanguage = extractPricingLanguage($)

  // Determine tone keywords
  const toneKeywords = determineTone(mainText)

  return {
    url,
    name,
    rawHtml: html,
    mainText,
    heroHeadline,
    subhead,
    ctaText,
    differentiators,
    testimonials,
    trustBadges,
    claims,
    pricingLanguage,
    toneKeywords,
  }
}

function extractHeroHeadline($: cheerio.CheerioAPI): string | undefined {
  // Look for h1 or large prominent text in hero section
  const h1 = $('h1').first().text().trim()
  if (h1) return h1

  // Try common hero selectors
  const heroSelectors = [
    '.hero h2',
    '.hero-title',
    '.hero-headline',
    '[class*="hero"] h2',
    '.banner h1',
    '.banner h2',
  ]

  for (const selector of heroSelectors) {
    const text = $(selector).first().text().trim()
    if (text && text.length > 10) return text
  }

  return undefined
}

function extractSubhead($: cheerio.CheerioAPI): string | undefined {
  // Look for subheadline near h1
  const h2AfterH1 = $('h1').first().next('h2, p').text().trim()
  if (h2AfterH1 && h2AfterH1.length > 10) return h2AfterH1

  const heroSubSelectors = [
    '.hero p',
    '.hero-subtitle',
    '[class*="hero"] p',
    '.banner p',
  ]

  for (const selector of heroSubSelectors) {
    const text = $(selector).first().text().trim()
    if (text && text.length > 10) return text
  }

  return undefined
}

function extractCTAs($: cheerio.CheerioAPI): string[] {
  const ctas: string[] = []

  // Look for buttons and prominent links
  $('button, .button, .btn, a.cta, [class*="cta"]').each((_, elem) => {
    const text = $(elem).text().trim()
    if (text && text.length < 50 && text.length > 2) {
      ctas.push(text)
    }
  })

  return [...new Set(ctas)].slice(0, 5)
}

function extractDifferentiators($: cheerio.CheerioAPI): string[] {
  const differentiators: string[] = []

  // Look for bullet points, feature lists
  $('ul li, ol li, [class*="feature"], [class*="benefit"]').each((_, elem) => {
    const text = $(elem).text().trim()
    if (text && text.length > 10 && text.length < 200) {
      differentiators.push(text)
    }
  })

  return [...new Set(differentiators)].slice(0, 8)
}

function extractTestimonials($: cheerio.CheerioAPI): string[] {
  const testimonials: string[] = []

  const testimonialSelectors = [
    '[class*="testimonial"]',
    '[class*="review"]',
    'blockquote',
    '[class*="quote"]',
  ]

  testimonialSelectors.forEach(selector => {
    $(selector).each((_, elem) => {
      const text = $(elem).text().trim()
      if (text && text.length > 20 && text.length < 500) {
        testimonials.push(text)
      }
    })
  })

  return [...new Set(testimonials)].slice(0, 5)
}

function extractTrustBadges($: cheerio.CheerioAPI): string[] {
  const badges: string[] = []

  // Look for trust indicators
  const trustSelectors = [
    '[class*="trust"]',
    '[class*="badge"]',
    '[class*="guarantee"]',
    '[class*="award"]',
  ]

  trustSelectors.forEach(selector => {
    $(selector).each((_, elem) => {
      const text = $(elem).text().trim()
      if (text && text.length > 2 && text.length < 100) {
        badges.push(text)
      }
    })
  })

  // Look for common trust phrases
  const trustPhrases = [
    'money back guarantee',
    'free shipping',
    'satisfaction guaranteed',
    'award winning',
    'certified',
    'trusted by',
  ]

  trustPhrases.forEach(phrase => {
    if ($('body').text().toLowerCase().includes(phrase)) {
      badges.push(phrase)
    }
  })

  return [...new Set(badges)].slice(0, 5)
}

function extractClaims($: cheerio.CheerioAPI): string[] {
  const claims: string[] = []
  const text = $('body').text().toLowerCase()

  // Common claim patterns
  const claimPatterns = [
    /(\d+[%+]?\s+(?:faster|better|more|less|cheaper|higher|lower|improved))/gi,
    /(?:rated|rated as|voted)\s+#?\d+/gi,
    /(award[- ]winning)/gi,
    /(industry[- ]leading)/gi,
    /(best-in-class)/gi,
  ]

  claimPatterns.forEach(pattern => {
    const matches = text.matchAll(pattern)
    for (const match of matches) {
      if (match[0]) {
        claims.push(match[0].trim())
      }
    }
  })

  return [...new Set(claims)].slice(0, 5)
}

function extractPricingLanguage($: cheerio.CheerioAPI): string[] {
  const pricing: string[] = []

  // Look for price-related content
  $('[class*="price"], [class*="pricing"], [class*="cost"]').each((_, elem) => {
    const text = $(elem).text().trim()
    if (text && text.length < 100) {
      pricing.push(text)
    }
  })

  // Look for pricing keywords
  const text = $('body').text()
  const pricingPatterns = [
    /\$\d+(?:,\d{3})*(?:\.\d{2})?(?:\s*(?:per|\/)\s*\w+)?/gi,
    /(?:from|starting at|only|just)\s+\$\d+/gi,
    /(?:free|premium|pro|basic|starter)\s+(?:plan|tier)/gi,
  ]

  pricingPatterns.forEach(pattern => {
    const matches = text.matchAll(pattern)
    for (const match of matches) {
      if (match[0]) {
        pricing.push(match[0].trim())
      }
    }
  })

  return [...new Set(pricing)].slice(0, 5)
}

function determineTone(text: string): string[] {
  const toneKeywords: string[] = []
  const lowerText = text.toLowerCase()

  const toneIndicators = {
    professional: ['expertise', 'professional', 'industry', 'solution', 'enterprise'],
    friendly: ['we', 'you', 'your', 'our', 'together', 'help'],
    urgent: ['now', 'today', 'limited', 'hurry', 'don\'t miss'],
    luxurious: ['premium', 'luxury', 'exclusive', 'bespoke', 'artisan'],
    playful: ['fun', 'enjoy', 'love', 'awesome', 'cool', 'great'],
    trustworthy: ['guarantee', 'trusted', 'proven', 'certified', 'reliable'],
    innovative: ['innovative', 'cutting-edge', 'advanced', 'revolutionary', 'new'],
  }

  for (const [tone, keywords] of Object.entries(toneIndicators)) {
    const count = keywords.filter(kw => lowerText.includes(kw)).length
    if (count >= 2) {
      toneKeywords.push(tone)
    }
  }

  return toneKeywords.length > 0 ? toneKeywords : ['neutral']
}

function structureData(extracted: CompetitorExtraction): CompetitorStructured {
  return {
    name: extracted.name,
    url: extracted.url,
    tagline: extracted.heroHeadline,
    primaryOffer: extracted.subhead || extracted.heroHeadline || 'Unknown',
    pricingCues: extracted.pricingLanguage?.join(' • '),
    socialProof: extracted.testimonials?.slice(0, 2),
    tone: extracted.toneKeywords || [],
    differentiators: extracted.differentiators || [],
    visualCues: [], // Would be filled from actual visual analysis
  }
}
