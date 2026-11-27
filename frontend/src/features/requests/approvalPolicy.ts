//Temporary approval rule evaluation
import type {
  Approver,
  Currency,
  SpendRequestForm,
} from './types'

// Temporary demonstration configuration
const policy = {
  largeSpendThresholdUSD: 5000,

  additionalApprover: {
    id: 'EMP-002',
    name: 'Nadia Frost',
    role: 'Additional Approval Authority',
  },
}

// Illustrative rates — not live exchange rates
const exchangeRates: Record<Currency, number> = {
  USD: 1,
  AED: 0.2723,
  EUR: 1.10,
  GBP: 1.25,
}

export const demoManager: Approver = {
  id: 'EMP-001',
  name: 'John Becker',
  role: 'Line Manager',
}

export function getApprovalChain(
  request: SpendRequestForm,
  manager: Approver = demoManager,
): Approver[] {

  const approvers: Approver[] = [manager]

  const amountUSD = Math.round(
    request.amount * exchangeRates[request.currency] * 100
  ) / 100

  const isLargeSpend =
    amountUSD > policy.largeSpendThresholdUSD

  const isITSpend =
    request.category.startsWith('IT /')

  if (isLargeSpend || isITSpend) {
    approvers.push(policy.additionalApprover)
  }

  // Remove duplicate approvers using employee IDs
  const uniqueApprovers = new Map<string, Approver>()

  for (const approver of approvers) {
    if (!uniqueApprovers.has(approver.id)) {
      uniqueApprovers.set(approver.id, approver)
    }
  }

  return Array.from(uniqueApprovers.values())
}