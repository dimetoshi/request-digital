import { z } from 'zod'

export const researchBriefSchema = z.object({
  industry: z.string().min(2, 'Industry must be at least 2 characters').max(200),
  serviceOffering: z.string().min(10, 'Please provide more details about your service offering').max(1000),
  targetCustomer: z.string().min(10, 'Please describe your target customer').max(1000),
  competitors: z.array(z.string().url('Must be a valid URL').or(z.string().min(2))).default([]),
  geography: z.string().min(2, 'Please specify your geography').max(200),
  pricePoint: z.enum(['budget', 'mid-range', 'premium', 'luxury']),
  brandTraits: z.object({
    premiumVsAffordable: z.number().min(0).max(100),
    boldVsMinimal: z.number().min(0).max(100),
    playfulVsSerious: z.number().min(0).max(100),
  }),
})

export type ResearchBriefInput = z.infer<typeof researchBriefSchema>

// Step-by-step form schemas
export const step1Schema = z.object({
  industry: z.string().min(2).max(200),
  serviceOffering: z.string().min(10).max(1000),
})

export const step2Schema = z.object({
  targetCustomer: z.string().min(10).max(1000),
  geography: z.string().min(2).max(200),
  pricePoint: z.enum(['budget', 'mid-range', 'premium', 'luxury']),
})

export const step3Schema = z.object({
  competitors: z.array(z.string()).default([]),
})

export const step4Schema = z.object({
  brandTraits: z.object({
    premiumVsAffordable: z.number().min(0).max(100),
    boldVsMinimal: z.number().min(0).max(100),
    playfulVsSerious: z.number().min(0).max(100),
  }),
})
