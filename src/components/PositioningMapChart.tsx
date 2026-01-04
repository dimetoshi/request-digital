'use client'

import { PositioningMap } from '@/types'

export default function PositioningMapChart({ data }: { data: PositioningMap }) {
  return (
    <div className="w-full">
      <div className="relative bg-gray-50 rounded-lg p-8" style={{ height: '500px' }}>
        {/* Y-axis label */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90">
          <div className="text-sm font-medium text-gray-700">{data.axes.y.label}</div>
        </div>

        {/* Chart area */}
        <div className="ml-12 h-full relative border-l-2 border-b-2 border-gray-300">
          {/* Y-axis labels */}
          <div className="absolute -left-3 top-0 -translate-y-1/2 text-xs text-gray-600">
            {data.axes.y.max}
          </div>
          <div className="absolute -left-3 bottom-0 translate-y-1/2 text-xs text-gray-600">
            {data.axes.y.min}
          </div>

          {/* X-axis labels */}
          <div className="absolute left-0 -bottom-8 text-xs text-gray-600">
            {data.axes.x.min}
          </div>
          <div className="absolute right-0 -bottom-8 text-xs text-gray-600">
            {data.axes.x.max}
          </div>

          {/* Quadrant lines */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-200" />

          {/* Data points */}
          {data.points.map((point, idx) => (
            <div
              key={idx}
              className="absolute"
              style={{
                left: `${point.x}%`,
                bottom: `${point.y}%`,
                transform: 'translate(-50%, 50%)',
              }}
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  point.isUser ? 'bg-primary-600 ring-4 ring-primary-200' : 'bg-gray-400'
                }`}
              />
              <div
                className={`absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs ${
                  point.isUser ? 'font-bold text-primary-900' : 'text-gray-600'
                }`}
              >
                {point.name}
              </div>
            </div>
          ))}
        </div>

        {/* X-axis label */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full mt-8">
          <div className="text-sm font-medium text-gray-700">{data.axes.x.label}</div>
        </div>
      </div>

      <div className="mt-12 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary-600 ring-4 ring-primary-200" />
          <span className="text-sm text-gray-700">Your Brand</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-400" />
          <span className="text-sm text-gray-700">Competitors</span>
        </div>
      </div>
    </div>
  )
}
