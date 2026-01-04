import { ResearchBrief } from '@/types'

/**
 * Stage B: Competitor Discovery
 * Discovers competitors through web search if user didn't provide enough
 */

interface CompetitorLead {
  name: string
  url: string
  snippet?: string
}

export async function discoverCompetitors(brief: ResearchBrief): Promise<CompetitorLead[]> {
  const providedCompetitors = brief.competitors || []

  // If user provided 8 or more, use those
  if (providedCompetitors.length >= 8) {
    return providedCompetitors.map(comp => ({
      name: extractNameFromUrl(comp),
      url: normalizeUrl(comp),
    }))
  }

  // Otherwise, attempt discovery
  const discovered: CompetitorLead[] = []

  try {
    // Construct search queries
    const queries = buildSearchQueries(brief)

    // Try to discover competitors from each query
    for (const query of queries) {
      const results = await searchWeb(query, brief.geography)
      discovered.push(...results)

      // Stop if we have enough
      if (discovered.length >= 12) break
    }

    // Combine provided and discovered, deduplicate
    const allCompetitors = [
      ...providedCompetitors.map(comp => ({
        name: extractNameFromUrl(comp),
        url: normalizeUrl(comp),
      })),
      ...discovered,
    ]

    return deduplicateCompetitors(allCompetitors).slice(0, 12)
  } catch (error) {
    console.error('Competitor discovery failed:', error)

    // Fallback: return what user provided
    if (providedCompetitors.length > 0) {
      return providedCompetitors.map(comp => ({
        name: extractNameFromUrl(comp),
        url: normalizeUrl(comp),
      }))
    }

    // If no competitors at all, return empty (caller should handle)
    return []
  }
}

function buildSearchQueries(brief: ResearchBrief): string[] {
  const { industry, geography, keywords } = brief
  const geo = geography.toLowerCase()

  return [
    `best ${industry} ${geo}`,
    `top ${industry} companies ${geo}`,
    `${industry} services ${geo}`,
    `${keywords?.[0] || industry} ${keywords?.[1] || ''} ${geo}`.trim(),
  ]
}

async function searchWeb(query: string, geography: string): Promise<CompetitorLead[]> {
  // Simple HTML-based search fallback
  // We'll use DuckDuckGo HTML search (no API key required)
  try {
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`

    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    })

    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`)
    }

    const html = await response.text()

    // Parse results from HTML
    return parseSearchResults(html)
  } catch (error) {
    console.error('Web search error:', error)
    return []
  }
}

function parseSearchResults(html: string): CompetitorLead[] {
  const results: CompetitorLead[] = []

  // Simple regex-based parsing (in production, use cheerio)
  // Look for result links
  const linkPattern = /<a[^>]+class="[^"]*result__a[^"]*"[^>]+href="([^"]+)"[^>]*>([^<]+)<\/a>/gi
  const snippetPattern = /<a[^>]+class="[^"]*result__snippet[^"]*"[^>]*>([^<]+)<\/a>/gi

  let match
  while ((match = linkPattern.exec(html)) !== null) {
    const url = decodeURIComponent(match[1])
    const title = match[2]

    // Filter out non-commercial sites
    if (isValidCompetitorUrl(url)) {
      results.push({
        name: cleanTitle(title),
        url: url,
      })
    }

    if (results.length >= 12) break
  }

  return results
}

function isValidCompetitorUrl(url: string): boolean {
  // Filter out common non-competitor domains
  const excludeDomains = [
    'facebook.com',
    'twitter.com',
    'linkedin.com',
    'instagram.com',
    'youtube.com',
    'wikipedia.org',
    'amazon.com',
    'ebay.com',
    'craigslist.org',
    'reddit.com',
  ]

  try {
    const urlObj = new URL(url)
    const domain = urlObj.hostname.toLowerCase()

    return !excludeDomains.some(excluded => domain.includes(excluded))
  } catch {
    return false
  }
}

function cleanTitle(title: string): string {
  // Remove common suffixes
  return title
    .replace(/\s*[-–|]\s*.*/g, '')
    .replace(/\s*\([^)]*\)/g, '')
    .trim()
}

function extractNameFromUrl(urlOrName: string): string {
  // If it's not a URL, return as-is
  if (!urlOrName.includes('http') && !urlOrName.includes('www.')) {
    return urlOrName
  }

  try {
    const url = new URL(urlOrName.startsWith('http') ? urlOrName : `https://${urlOrName}`)
    let name = url.hostname.replace(/^www\./, '').split('.')[0]

    // Capitalize
    name = name.charAt(0).toUpperCase() + name.slice(1)

    return name
  } catch {
    return urlOrName
  }
}

function normalizeUrl(urlOrName: string): string {
  // If already a URL, return it
  if (urlOrName.startsWith('http://') || urlOrName.startsWith('https://')) {
    return urlOrName
  }

  // If starts with www, add https
  if (urlOrName.startsWith('www.')) {
    return `https://${urlOrName}`
  }

  // If it looks like a domain
  if (urlOrName.includes('.')) {
    return `https://${urlOrName}`
  }

  // Otherwise, it might be a brand name - try to make it a URL
  return `https://www.${urlOrName.toLowerCase().replace(/\s+/g, '')}.com`
}

function deduplicateCompetitors(competitors: CompetitorLead[]): CompetitorLead[] {
  const seen = new Set<string>()
  const unique: CompetitorLead[] = []

  for (const comp of competitors) {
    try {
      const url = new URL(comp.url)
      const domain = url.hostname.toLowerCase().replace(/^www\./, '')

      if (!seen.has(domain)) {
        seen.add(domain)
        unique.push(comp)
      }
    } catch {
      // If URL parsing fails, check by name
      const nameLower = comp.name.toLowerCase()
      if (!seen.has(nameLower)) {
        seen.add(nameLower)
        unique.push(comp)
      }
    }
  }

  return unique
}
