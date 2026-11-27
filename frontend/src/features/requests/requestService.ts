//Persistence and future API integration
import type {
  SpendRequest,
  SpendRequestForm,
} from './types'

import { getApprovalChain } from './approvalPolicy'
import { requestSchema } from './requestSchema'

const STORAGE_KEY = 'spendora_requests_v1'

export function getRequests(): SpendRequest[] {
  const data = localStorage.getItem(STORAGE_KEY)

  return data ? JSON.parse(data) : []
}

export function submitRequest(
  form: SpendRequestForm,
): SpendRequest {

  const validatedForm = requestSchema.parse(form)

  const request: SpendRequest = {
    ...validatedForm,

    id: `REQ-${crypto.randomUUID()}`,

    version: 1,

    requester: 'Priya Sharma',

    department: 'Operations',

    status: 'PENDING_APPROVAL',

    createdAt: new Date().toISOString(),

    approvalChain: getApprovalChain(validatedForm),
  }

  const requests = getRequests()

  requests.unshift(request)

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(requests)
  )

  return request
}