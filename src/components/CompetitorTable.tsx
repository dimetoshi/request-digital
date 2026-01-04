'use client'

import { useState } from 'react'
import { CompetitorStructured } from '@/types'

export default function CompetitorTable({ competitors }: { competitors: CompetitorStructured[] }) {
  const [sortBy, setSortBy] = useState<'name' | 'tone'>('name')

  const sorted = [...competitors].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name)
    }
    return a.tone.length - b.tone.length
  })

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th
              className="text-left py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50"
              onClick={() => setSortBy('name')}
            >
              Name {sortBy === 'name' && '↓'}
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">
              Primary Offer
            </th>
            <th
              className="text-left py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50"
              onClick={() => setSortBy('tone')}
            >
              Tone {sortBy === 'tone' && '↓'}
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">
              Pricing
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">
              URL
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((comp, idx) => (
            <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4 font-medium">{comp.name}</td>
              <td className="py-3 px-4 text-sm text-gray-700">
                {comp.primaryOffer.length > 60
                  ? comp.primaryOffer.slice(0, 60) + '...'
                  : comp.primaryOffer}
              </td>
              <td className="py-3 px-4">
                <div className="flex flex-wrap gap-1">
                  {comp.tone.slice(0, 3).map((t, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">
                {comp.pricingCues || 'N/A'}
              </td>
              <td className="py-3 px-4 text-sm">
                <a
                  href={comp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 hover:underline"
                >
                  Visit →
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
