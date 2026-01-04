import { BrandingOpportunity } from '@/types'

export default function OpportunityCard({
  opportunity,
  rank,
}: {
  opportunity: BrandingOpportunity
  rank: number
}) {
  const categoryColors: Record<string, string> = {
    positioning: 'bg-purple-100 text-purple-800 border-purple-200',
    differentiation: 'bg-blue-100 text-blue-800 border-blue-200',
    messaging: 'bg-green-100 text-green-800 border-green-200',
    visual: 'bg-pink-100 text-pink-800 border-pink-200',
    offer: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    content: 'bg-orange-100 text-orange-800 border-orange-200',
  }

  const categoryColor = categoryColors[opportunity.category] || 'bg-gray-100 text-gray-800 border-gray-200'

  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
            #{rank}
          </div>
          <div>
            <h3 className="font-bold text-lg">{opportunity.title}</h3>
            <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${categoryColor}`}>
              {opportunity.category}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-primary-600">{opportunity.score}</div>
          <div className="text-xs text-gray-500">/ 100</div>
        </div>
      </div>

      <p className="text-gray-700 mb-4">{opportunity.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <div className="text-xs text-gray-600 mb-1">Demand Signal</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${opportunity.demandSignal}%` }}
              />
            </div>
            <span className="text-xs font-medium">{opportunity.demandSignal}</span>
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-600 mb-1">Whitespace</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${opportunity.differentiationWhitespace}%` }}
              />
            </div>
            <span className="text-xs font-medium">{opportunity.differentiationWhitespace}</span>
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-600 mb-1">Feasibility</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full"
                style={{ width: `${opportunity.credibilityFeasibility}%` }}
              />
            </div>
            <span className="text-xs font-medium">{opportunity.credibilityFeasibility}</span>
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-600 mb-1">Speed</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full"
                style={{ width: `${opportunity.speedToImplement}%` }}
              />
            </div>
            <span className="text-xs font-medium">{opportunity.speedToImplement}</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm font-semibold text-gray-700 mb-1">Rationale:</div>
        <p className="text-sm text-gray-600">{opportunity.rationale}</p>
      </div>

      <div className="mb-4">
        <div className="text-sm font-semibold text-gray-700 mb-1">Competitor Gap:</div>
        <p className="text-sm text-gray-600">{opportunity.competitorGap}</p>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold text-gray-700">Next Steps:</div>
          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
            {opportunity.timeframe}
          </span>
        </div>
        <ul className="space-y-1">
          {opportunity.nextSteps.map((step, idx) => (
            <li key={idx} className="text-sm text-gray-600 flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              {step}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
