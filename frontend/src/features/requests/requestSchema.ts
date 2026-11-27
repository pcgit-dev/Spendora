//Form validation and business constraints
import { z } from 'zod'
import { CURRENCIES, CATEGORIES } from './types'

export const requestSchema = z.object({
  title: z.string()
    .trim()
    .min(5, 'Enter at least 5 characters')
    .max(150),

  amount: z.number()
    .positive('Amount must be greater than zero')
    .max(100000000, 'Amount exceeds the demo limit'),

  currency: z.enum(CURRENCIES),

  category: z.enum(CATEGORIES),

  supplier: z.string().trim().max(150),

  project: z.string(),

  trip: z.string(),

  justification: z.string()
    .trim()
    .min(10, 'Provide a valid business justification')
    .max(2000),

  quoteName: z.string(),

  noQuoteReason: z.string().trim().max(1000),

})
.refine(
  (data) =>
    data.quoteName.length > 0 ||
    data.noQuoteReason.length >= 5,
  {
    message: 'Attach a quotation or provide a reason',
    path: ['noQuoteReason'],
  }
)
.refine(
  (data) =>
    !data.category.startsWith('IT /') ||
    data.project.length > 0,
  {
    message: 'Select a project for IT expenditure',
    path: ['project'],
  }
)
.refine(
  (data) =>
    data.category !== 'Travel' ||
    data.trip.length > 0,
  {
    message: 'Select a trip for travel expenditure',
    path: ['trip'],
  }
)