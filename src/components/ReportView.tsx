'use client'

import { ResearchResults } from '@/types'
import PositioningMapChart from './PositioningMapChart'
import OpportunityCard from './OpportunityCard'
import CompetitorTable from './CompetitorTable'
import { exportReportToMarkdown } from '@/actions/research'
import { useState } from 'react'

export default function ReportView({ report }: { report: any }) {
  const results = report.results as ResearchResults
  const [isExporting, setIsExporting] = useState(false)

  const handleExportMarkdown = async () => {
    setIsExporting(true)
    try {
      const markdown = await exportReportToMarkdown(report.id)

      // Download the markdown file
      const blob = new Blob([markdown], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `branding-report-${report.id}.md`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export report')
    } finally {
      setIsExporting(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">{report.brief.industry}</h1>
            <p className="text-gray-600">
              {report.brief.geography} • Generated {new Date(report.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExportMarkdown}
              disabled={isExporting}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              {isExporting ? 'Exporting...' : 'Export Markdown'}
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Print / PDF
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Executive Summary */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Executive Summary</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-line">{results.executiveSummary}</p>
          </div>
        </section>

        {/* Market Landscape */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Market Landscape</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-line">{results.marketLandscape}</p>
          </div>
        </section>

        {/* Competitor Snapshot */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Competitor Snapshot</h2>
          <CompetitorTable competitors={results.competitorSnapshot} />
        </section>

        {/* Positioning Map */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Positioning Map</h2>
          <PositioningMapChart data={results.positioningMap} />
        </section>

        {/* Top Opportunities */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Top Branding Opportunities</h2>
          <div className="space-y-4">
            {results.opportunities.map((opp, index) => (
              <OpportunityCard key={opp.id} opportunity={opp} rank={index + 1} />
            ))}
          </div>
        </section>

        {/* Quick Wins */}
        <section className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4 text-green-900">
            ⚡ Quick Wins (7-Day Implementations)
          </h2>
          <div className="space-y-4">
            {results.quickWins.map(win => (
              <div key={win.id} className="bg-white rounded-lg p-6">
                <h3 className="font-bold text-lg mb-2">{win.title}</h3>
                <p className="text-gray-700 mb-3">{win.description}</p>
                <div className="border-t pt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Next Steps:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {win.nextSteps.map((step, idx) => (
                      <li key={idx} className="text-sm text-gray-600">{step}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Strategic Plays */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-900">
            🎯 Strategic Plays (30-90 Days)
          </h2>
          <div className="space-y-4">
            {results.strategicPlays.map(play => (
              <div key={play.id} className="bg-white rounded-lg p-6">
                <h3 className="font-bold text-lg mb-2">{play.title}</h3>
                <p className="text-gray-700 mb-3">{play.description}</p>
                <div className="border-t pt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Next Steps:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {play.nextSteps.map((step, idx) => (
                      <li key={idx} className="text-sm text-gray-600">{step}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Messaging Cheat Sheet */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Messaging Cheat Sheet</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Promise</h3>
              <p className="text-gray-700 text-lg italic">"{results.messagingCheatSheet.promise}"</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Reasons to Believe</h3>
              <ul className="list-disc list-inside space-y-1">
                {results.messagingCheatSheet.reasonsToBelieve.map((reason, idx) => (
                  <li key={idx} className="text-gray-700">{reason}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Tone Guidelines</h3>
              <ul className="list-disc list-inside space-y-1">
                {results.messagingCheatSheet.toneGuidelines.map((guideline, idx) => (
                  <li key={idx} className="text-gray-700">{guideline}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Objection Handling</h3>
              <div className="space-y-3">
                {results.messagingCheatSheet.objectionHandling.map((item, idx) => (
                  <div key={idx} className="border-l-4 border-primary-500 pl-4">
                    <p className="font-medium text-gray-900">"{item.objection}"</p>
                    <p className="text-gray-700 text-sm mt-1">→ {item.response}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Proof Points</h3>
              <ul className="list-disc list-inside space-y-1">
                {results.messagingCheatSheet.proofPoints.map((point, idx) => (
                  <li key={idx} className="text-gray-700">{point}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Visual Direction */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Visual Direction</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Style Cues</h3>
              <div className="flex flex-wrap gap-2">
                {results.visualDirection.styleCues.map((cue, idx) => (
                  <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    {cue}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Typography Tone</h3>
              <div className="flex flex-wrap gap-2">
                {results.visualDirection.typographyTone.map((tone, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {tone}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Color Mood</h3>
              <div className="flex flex-wrap gap-2">
                {results.visualDirection.colorMood.map((mood, idx) => (
                  <span key={idx} className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm">
                    {mood}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Example Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {results.visualDirection.exampleKeywords.map((keyword, idx) => (
                  <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-2">Avoid These Patterns</h4>
            <ul className="list-disc list-inside space-y-1">
              {results.visualDirection.avoidPatterns.map((pattern, idx) => (
                <li key={idx} className="text-yellow-800 text-sm">{pattern}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
