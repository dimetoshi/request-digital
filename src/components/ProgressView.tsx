'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProgressView({ report }: { report: any }) {
  const router = useRouter()
  const [progress, setProgress] = useState(report.progress || 0)

  useEffect(() => {
    // Poll for updates every 3 seconds
    const interval = setInterval(() => {
      router.refresh()
    }, 3000)

    return () => clearInterval(interval)
  }, [router])

  const progressData = report.results?.progress || {
    stage: 'pending',
    percentage: progress,
    message: 'Starting research...',
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Research in Progress</h2>

          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {progressData.message}
              </span>
              <span className="text-sm font-medium text-primary-600">
                {progressData.percentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-primary-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressData.percentage}%` }}
              />
            </div>
          </div>

          <div className="space-y-4">
            <StageIndicator
              label="Normalizing inputs"
              completed={progressData.percentage > 10}
              active={progressData.stage === 'normalizing'}
            />
            <StageIndicator
              label="Discovering competitors"
              completed={progressData.percentage > 35}
              active={progressData.stage === 'discovering'}
            />
            <StageIndicator
              label="Parsing competitor data"
              completed={progressData.percentage > 70}
              active={progressData.stage === 'parsing'}
            />
            <StageIndicator
              label="Generating insights"
              completed={progressData.percentage > 95}
              active={progressData.stage === 'analyzing'}
            />
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> This process typically takes 2-5 minutes depending on the number of competitors.
              The page will automatically refresh when complete.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function StageIndicator({
  label,
  completed,
  active,
}: {
  label: string
  completed: boolean
  active: boolean
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center ${
          completed
            ? 'bg-green-500'
            : active
            ? 'bg-primary-500 animate-pulse'
            : 'bg-gray-300'
        }`}
      >
        {completed && (
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
      <span
        className={`text-sm ${
          completed ? 'text-green-700 font-medium' : active ? 'text-primary-700 font-medium' : 'text-gray-500'
        }`}
      >
        {label}
      </span>
    </div>
  )
}
