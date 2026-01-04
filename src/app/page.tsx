import Link from 'next/link'
import { getAllReports } from '@/actions/research'

export default async function HomePage() {
  const reports = await getAllReports()

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h2 className="text-5xl font-bold mb-6 text-balance">
          Discover Your Brand's Competitive Edge
        </h2>
        <p className="text-xl text-gray-600 mb-8 text-balance">
          Conduct AI-powered market research to identify branding opportunities,
          positioning gaps, and messaging angles that set you apart.
        </p>
        <Link
          href="/wizard"
          className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors"
        >
          Start New Research
        </Link>
      </div>

      {/* How it works */}
      <div className="max-w-5xl mx-auto mb-16">
        <h3 className="text-2xl font-bold mb-8 text-center">How It Works</h3>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-xl mb-4">
              1
            </div>
            <h4 className="font-semibold mb-2">Share Your Details</h4>
            <p className="text-gray-600 text-sm">
              Tell us about your industry, service offering, target customer, and geography.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-xl mb-4">
              2
            </div>
            <h4 className="font-semibold mb-2">AI Analysis</h4>
            <p className="text-gray-600 text-sm">
              Our system discovers competitors, analyzes their positioning, messaging, and visual identity.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-xl mb-4">
              3
            </div>
            <h4 className="font-semibold mb-2">Opportunity Scoring</h4>
            <p className="text-gray-600 text-sm">
              Get scored opportunities across positioning, messaging, visual identity, and content.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-xl mb-4">
              4
            </div>
            <h4 className="font-semibold mb-2">Actionable Report</h4>
            <p className="text-gray-600 text-sm">
              Receive quick wins (7 days) and strategic plays (30-90 days) with clear next steps.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      {reports.length > 0 && (
        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold mb-6">Recent Reports</h3>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-200">
              {reports.slice(0, 10).map(report => (
                <Link
                  key={report.id}
                  href={`/reports/${report.id}`}
                  className="block p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{report.brief.industry}</h4>
                      <p className="text-sm text-gray-600">
                        {report.brief.geography} • {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {report.status === 'completed' && (
                        <span className="text-green-600 font-medium text-sm">Completed</span>
                      )}
                      {report.status === 'processing' && (
                        <span className="text-blue-600 font-medium text-sm">
                          Processing ({report.progress}%)
                        </span>
                      )}
                      {report.status === 'failed' && (
                        <span className="text-red-600 font-medium text-sm">Failed</span>
                      )}
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
