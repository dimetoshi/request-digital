import { ResearchBrief, PipelineProgress, ResearchResults } from '@/types'
import { prisma } from '../prisma'
import { normalizeInput } from './normalize'
import { discoverCompetitors } from './discover'
import { parseCompetitorPage } from './parse'
import { generateInsights } from './analyze'

/**
 * Main Research Pipeline
 * Orchestrates all stages and tracks progress
 */

export async function runResearchPipeline(
  reportId: string,
  brief: ResearchBrief,
  onProgress?: (progress: PipelineProgress) => void
): Promise<ResearchResults> {
  try {
    // Stage A: Normalize input
    await updateProgress(reportId, {
      stage: 'normalizing',
      percentage: 10,
      message: 'Analyzing your inputs and generating research parameters...',
    }, onProgress)

    const normalizedBrief = await normalizeInput(brief)

    // Stage B: Discover competitors
    await updateProgress(reportId, {
      stage: 'discovering',
      percentage: 25,
      message: 'Discovering and analyzing competitors...',
    }, onProgress)

    const competitorLeads = await discoverCompetitors(normalizedBrief)

    if (competitorLeads.length === 0) {
      throw new Error('No competitors found. Please provide at least 3 competitor URLs.')
    }

    await updateProgress(reportId, {
      stage: 'discovering',
      percentage: 35,
      message: `Found ${competitorLeads.length} competitors. Starting analysis...`,
    }, onProgress)

    // Stage C: Parse competitor pages
    await updateProgress(reportId, {
      stage: 'parsing',
      percentage: 40,
      message: 'Extracting data from competitor websites...',
    }, onProgress)

    const competitors = []
    const totalCompetitors = competitorLeads.length
    let parsedCount = 0

    for (const lead of competitorLeads) {
      try {
        const { extracted, structured } = await parseCompetitorPage(lead.url, lead.name)

        // Save to database
        await prisma.competitor.create({
          data: {
            reportId,
            name: structured.name,
            url: structured.url,
            extractedJson: JSON.stringify(extracted),
            structuredJson: JSON.stringify(structured),
          },
        })

        competitors.push(structured)
        parsedCount++

        // Update progress
        const progressPercentage = 40 + Math.floor((parsedCount / totalCompetitors) * 30)
        await updateProgress(reportId, {
          stage: 'parsing',
          percentage: progressPercentage,
          message: `Analyzed ${parsedCount}/${totalCompetitors} competitors...`,
        }, onProgress)
      } catch (error) {
        console.error(`Failed to parse ${lead.name}:`, error)
        // Continue with other competitors
      }
    }

    if (competitors.length === 0) {
      throw new Error('Failed to analyze any competitor websites. Please check URLs and try again.')
    }

    // Stage D: Generate insights
    await updateProgress(reportId, {
      stage: 'analyzing',
      percentage: 75,
      message: 'Generating branding opportunities and insights...',
    }, onProgress)

    const results = await generateInsights(normalizedBrief, competitors)

    // Complete
    await updateProgress(reportId, {
      stage: 'complete',
      percentage: 100,
      message: 'Research complete!',
    }, onProgress)

    return results
  } catch (error) {
    console.error('Pipeline error:', error)

    await updateProgress(reportId, {
      stage: 'error',
      percentage: 0,
      message: error instanceof Error ? error.message : 'An error occurred during research',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, onProgress)

    throw error
  }
}

async function updateProgress(
  reportId: string,
  progress: PipelineProgress,
  onProgress?: (progress: PipelineProgress) => void
) {
  // Update database
  await prisma.report.update({
    where: { id: reportId },
    data: {
      progress: progress.percentage,
      resultsJson: JSON.stringify({ progress }),
    },
  })

  // Call progress callback if provided
  if (onProgress) {
    onProgress(progress)
  }
}
