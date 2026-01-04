import { notFound } from 'next/navigation'
import { getReport } from '@/actions/research'
import ReportView from '@/components/ReportView'
import ProgressView from '@/components/ProgressView'

export default async function ReportPage({ params }: { params: { id: string } }) {
  const report = await getReport(params.id)

  if (!report) {
    notFound()
  }

  // If still processing, show progress
  if (report.status === 'processing' || report.status === 'pending') {
    return <ProgressView report={report} />
  }

  // If failed, show error
  if (report.status === 'failed') {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-red-900 mb-4">Research Failed</h2>
            <p className="text-red-700 mb-6">
              {report.results?.error || 'An error occurred during research. Please try again.'}
            </p>
            <a
              href="/wizard"
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Start New Research
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Show completed report
  return <ReportView report={report} />
}
