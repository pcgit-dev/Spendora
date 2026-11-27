//Business data models
export const CURRENCIES = ['USD', 'AED', 'EUR', 'GBP'] as const

export const CATEGORIES = [
  'IT / Software',
  'IT / Hardware',
  'Travel',
  'Office Equipment',
  'Consultancy',
  'Training',
  'Other',
] as const

export type Currency = typeof CURRENCIES[number]
export type Category = typeof CATEGORIES[number]

export type RequestStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED'

export interface SpendRequestForm {
  title: string
  amount: number
  currency: Currency
  category: Category
  supplier: string
  project: string
  trip: string
  justification: string
  quoteName: string
  noQuoteReason: string
}

export interface Approver {
  id: string
  name: string
  role: string
}

export interface SpendRequest extends SpendRequestForm {
  id: string
  version: number
  requester: string
  department: string
  status: RequestStatus
  createdAt: string
  approvalChain: Approver[]
}