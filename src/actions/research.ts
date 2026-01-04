'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { researchBriefSchema } from '@/lib/validations'
import { runResearchPipeline } from '@/lib/research/pipeline'
import { ResearchResults } from '@/types'

export async function createResearchReport(formData: unknown) {
  try {
    // Validate input
    const validated = researchBriefSchema.parse(formData)

    // Create report in database
    const report = await prisma.report.create({
      data: {
        briefJson: JSON.stringify(validated),
        resultsJson: JSON.stringify({ progress: { stage: 'pending', percentage: 0, message: 'Starting research...' } }),
        status: 'pending',
        progress: 0,
      },
    })

    // Start research pipeline (this will run asynchronously)
    // In a production app, you'd use a background job queue
    // For this demo, we'll run it directly but in a non-blocking way
    runPipeline(report.id, validated).catch(console.error)

    revalidatePath('/reports')

    return {
      success: true,
      reportId: report.id,
    }
  } catch (error) {
    console.error('Failed to create research report:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create report',
    }
  }
}

async function runPipeline(reportId: string, brief: any) {
  try {
    // Update status to processing
    await prisma.report.update({
      where: { id: reportId },
      data: { status: 'processing' },
    })

    // Run the pipeline
    const results = await runResearchPipeline(reportId, brief)

    // Save results
    await prisma.report.update({
      where: { id: reportId },
      data: {
        resultsJson: JSON.stringify(results),
        status: 'completed',
        progress: 100,
      },
    })

    revalidatePath(`/reports/${reportId}`)
  } catch (error) {
    console.error('Pipeline failed:', error)

    await prisma.report.update({
      where: { id: reportId },
      data: {
        status: 'failed',
        resultsJson: JSON.stringify({
          error: error instanceof Error ? error.message : 'Pipeline failed',
        }),
      },
    })

    revalidatePath(`/reports/${reportId}`)
  }
}

export async function getReport(reportId: string) {
  try {
    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: {
        competitors: true,
      },
    })

    if (!report) {
      return null
    }

    return {
      id: report.id,
      createdAt: report.createdAt,
      status: report.status,
      progress: report.progress,
      brief: JSON.parse(report.briefJson),
      results: report.resultsJson ? JSON.parse(report.resultsJson) : null,
      competitors: report.competitors.map(c => ({
        id: c.id,
        name: c.name,
        url: c.url,
        structured: JSON.parse(c.structuredJson),
      })),
    }
  } catch (error) {
    console.error('Failed to get report:', error)
    return null
  }
}

export async function getAllReports() {
  try {
    const reports = await prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return reports.map(report => ({
      id: report.id,
      createdAt: report.createdAt,
      status: report.status,
      progress: report.progress,
      brief: JSON.parse(report.briefJson),
    }))
  } catch (error) {
    console.error('Failed to get reports:', error)
    return []
  }
}

export async function exportReportToMarkdown(reportId: string): Promise<string> {
  const report = await getReport(reportId)
  if (!report || !report.results) {
    throw new Error('Report not found or not completed')
  }

  const results = report.results as ResearchResults
  const brief = report.brief

  let markdown = `# Branding Opportunity Finder Report\n\n`
  markdown += `**Generated:** ${new Date(report.createdAt).toLocaleDateString()}\n\n`
  markdown += `**Industry:** ${brief.industry}\n`
  markdown += `**Geography:** ${brief.geography}\n\n`

  markdown += `---\n\n`
  markdown += `## Executive Summary\n\n${results.executiveSummary}\n\n`

  markdown += `---\n\n`
  markdown += `## Market Landscape\n\n${results.marketLandscape}\n\n`

  markdown += `---\n\n`
  markdown += `## Competitor Snapshot\n\n`
  markdown += `| Name | Primary Offer | Tone | Pricing |\n`
  markdown += `|------|---------------|------|----------|\n`
  results.competitorSnapshot.forEach(comp => {
    markdown += `| ${comp.name} | ${comp.primaryOffer} | ${comp.tone.join(', ')} | ${comp.pricingCues || 'N/A'} |\n`
  })

  markdown += `\n---\n\n`
  markdown += `## Top Branding Opportunities\n\n`
  results.opportunities.forEach((opp, index) => {
    markdown += `### ${index + 1}. ${opp.title} (Score: ${opp.score}/100)\n\n`
    markdown += `**Category:** ${opp.category}\n\n`
    markdown += `**Description:** ${opp.description}\n\n`
    markdown += `**Rationale:** ${opp.rationale}\n\n`
    markdown += `**Competitor Gap:** ${opp.competitorGap}\n\n`
    markdown += `**Timeframe:** ${opp.timeframe}\n\n`
    markdown += `**Next Steps:**\n`
    opp.nextSteps.forEach(step => {
      markdown += `- ${step}\n`
    })
    markdown += `\n`
  })

  markdown += `---\n\n`
  markdown += `## Quick Wins (7-Day Implementations)\n\n`
  results.quickWins.forEach(win => {
    markdown += `### ${win.title}\n${win.description}\n\n`
  })

  markdown += `\n---\n\n`
  markdown += `## Strategic Plays (30-90 Days)\n\n`
  results.strategicPlays.forEach(play => {
    markdown += `### ${play.title}\n${play.description}\n\n`
  })

  markdown += `\n---\n\n`
  markdown += `## Messaging Cheat Sheet\n\n`
  markdown += `**Promise:** ${results.messagingCheatSheet.promise}\n\n`
  markdown += `**Reasons to Believe:**\n`
  results.messagingCheatSheet.reasonsToBelieve.forEach(reason => {
    markdown += `- ${reason}\n`
  })
  markdown += `\n**Tone Guidelines:**\n`
  results.messagingCheatSheet.toneGuidelines.forEach(guideline => {
    markdown += `- ${guideline}\n`
  })

  markdown += `\n---\n\n`
  markdown += `## Visual Direction\n\n`
  markdown += `**Style Cues:** ${results.visualDirection.styleCues.join(', ')}\n\n`
  markdown += `**Typography Tone:** ${results.visualDirection.typographyTone.join(', ')}\n\n`
  markdown += `**Color Mood:** ${results.visualDirection.colorMood.join(', ')}\n\n`
  markdown += `**Example Keywords:** ${results.visualDirection.exampleKeywords.join(', ')}\n\n`

  return markdown
}
