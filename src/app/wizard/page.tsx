'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createResearchReport } from '@/actions/research'

type FormData = {
  industry: string
  serviceOffering: string
  targetCustomer: string
  geography: string
  pricePoint: 'budget' | 'mid-range' | 'premium' | 'luxury'
  competitors: string[]
  brandTraits: {
    premiumVsAffordable: number
    boldVsMinimal: number
    playfulVsSerious: number
  }
}

export default function WizardPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState<FormData>({
    industry: '',
    serviceOffering: '',
    targetCustomer: '',
    geography: '',
    pricePoint: 'mid-range',
    competitors: ['', '', ''],
    brandTraits: {
      premiumVsAffordable: 50,
      boldVsMinimal: 50,
      playfulVsSerious: 50,
    },
  })

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const updateBrandTrait = (trait: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      brandTraits: { ...prev.brandTraits, [trait]: value },
    }))
  }

  const updateCompetitor = (index: number, value: string) => {
    setFormData(prev => {
      const newCompetitors = [...prev.competitors]
      newCompetitors[index] = value
      return { ...prev, competitors: newCompetitors }
    })
  }

  const addCompetitor = () => {
    setFormData(prev => ({
      ...prev,
      competitors: [...prev.competitors, ''],
    }))
  }

  const nextStep = () => {
    if (validateStep()) {
      setStep(prev => Math.min(prev + 1, 4))
    }
  }

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1))
  }

  const validateStep = (): boolean => {
    setError('')

    if (step === 1) {
      if (!formData.industry || formData.industry.length < 2) {
        setError('Please enter your industry')
        return false
      }
      if (!formData.serviceOffering || formData.serviceOffering.length < 10) {
        setError('Please provide more details about your service offering')
        return false
      }
    }

    if (step === 2) {
      if (!formData.targetCustomer || formData.targetCustomer.length < 10) {
        setError('Please describe your target customer')
        return false
      }
      if (!formData.geography || formData.geography.length < 2) {
        setError('Please specify your geography')
        return false
      }
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateStep()) return

    setIsSubmitting(true)
    setError('')

    try {
      // Filter out empty competitor strings
      const cleanedCompetitors = formData.competitors.filter(c => c.trim() !== '')

      const result = await createResearchReport({
        ...formData,
        competitors: cleanedCompetitors,
      })

      if (result.success && result.reportId) {
        router.push(`/reports/${result.reportId}`)
      } else {
        setError(result.error || 'Failed to create report')
        setIsSubmitting(false)
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`flex-1 ${s < 4 ? 'mr-2' : ''}`}
              >
                <div
                  className={`h-2 rounded-full ${
                    s <= step ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Industry & Offering</span>
            <span>Customer & Geography</span>
            <span>Competitors</span>
            <span>Brand Traits</span>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Step 1: Industry & Offering */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Industry & Service Offering</h2>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Industry *
                </label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={e => updateFormData('industry', e.target.value)}
                  placeholder="e.g., Manuka honey, portable aircon hire, pet health clinic"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Service Offering *
                </label>
                <textarea
                  value={formData.serviceOffering}
                  onChange={e => updateFormData('serviceOffering', e.target.value)}
                  placeholder="Describe what you sell, how it's delivered, and what makes it unique..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Include details about delivery method, pricing tier, and unique features
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Customer & Geography */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Target Customer & Geography</h2>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Target Customer (ICP) *
                </label>
                <textarea
                  value={formData.targetCustomer}
                  onChange={e => updateFormData('targetCustomer', e.target.value)}
                  placeholder="Describe your ideal customer: demographics, pain points, behaviors..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Geography *
                </label>
                <input
                  type="text"
                  value={formData.geography}
                  onChange={e => updateFormData('geography', e.target.value)}
                  placeholder="e.g., New York City, United States, Australia"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Price Point *
                </label>
                <select
                  value={formData.pricePoint}
                  onChange={e => updateFormData('pricePoint', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="budget">Budget</option>
                  <option value="mid-range">Mid-Range</option>
                  <option value="premium">Premium</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 3: Competitors */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Competitors</h2>
              <p className="text-gray-600 mb-4">
                Provide competitor URLs or names (optional). If left blank, we'll discover competitors for you.
              </p>

              {formData.competitors.map((comp, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium mb-2">
                    Competitor {index + 1}
                  </label>
                  <input
                    type="text"
                    value={comp}
                    onChange={e => updateCompetitor(index, e.target.value)}
                    placeholder="https://competitor.com or Competitor Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={addCompetitor}
                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                + Add Another Competitor
              </button>
            </div>
          )}

          {/* Step 4: Brand Traits */}
          {step === 4 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold mb-6">Brand Traits</h2>
              <p className="text-gray-600 mb-4">
                Adjust the sliders to reflect your desired brand positioning:
              </p>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Affordable</span>
                  <span className="text-sm font-medium">Premium</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.brandTraits.premiumVsAffordable}
                  onChange={e => updateBrandTrait('premiumVsAffordable', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-500 mt-1">
                  {formData.brandTraits.premiumVsAffordable}%
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Minimal</span>
                  <span className="text-sm font-medium">Bold</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.brandTraits.boldVsMinimal}
                  onChange={e => updateBrandTrait('boldVsMinimal', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-500 mt-1">
                  {formData.brandTraits.boldVsMinimal}%
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Serious</span>
                  <span className="text-sm font-medium">Playful</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.brandTraits.playfulVsSerious}
                  onChange={e => updateBrandTrait('playfulVsSerious', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-500 mt-1">
                  {formData.brandTraits.playfulVsSerious}%
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Previous
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Starting Research...' : 'Start Research'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
