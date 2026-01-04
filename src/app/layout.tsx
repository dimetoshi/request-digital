import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Branding Opportunity Finder',
  description: 'Discover branding opportunities and positioning angles through AI-powered market research',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <div className="min-h-screen flex flex-col">
          <header className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 py-4">
              <h1 className="text-2xl font-bold text-primary-600">
                Branding Opportunity Finder
              </h1>
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
          <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-500">
              <p>© {new Date().getFullYear()} Branding Opportunity Finder. AI-powered market research.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
