
import type {
  SpendRequest,
  SpendRequestForm,
  Approver,
  ApprovalDecision,
} from './types'

import { getApprovalChain } from './approvalPolicy'
import { requestSchema } from './requestSchema'

import {
  DEMO_USERS,
  DEFAULT_USER,
} from '@/config/demoUsers'

const STORAGE_KEY = 'spendora_requests_v1'

// Retrieve all requests
export function getRequests(): SpendRequest[] {

  const data = localStorage.getItem(STORAGE_KEY)

  return data ? JSON.parse(data) : []
}

// Persist requests
function saveRequests(requests: SpendRequest[]): void {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(requests)
  )
}

// Submit a new request
export function submitRequest(
  form: SpendRequestForm,
): SpendRequest {

  const validatedForm = requestSchema.parse(form)

  const request: SpendRequest = {
    ...validatedForm,

    id: `REQ-${crypto.randomUUID()}`,

    version: 1,

    requester: DEFAULT_USER.name,

    department: DEFAULT_USER.department,

    status: 'PENDING_APPROVAL',

    createdAt: new Date().toISOString(),

    approvalChain: getApprovalChain(validatedForm),

    approvalDecisions: [],
  }

  const requests = getRequests()

  requests.unshift(request)

  saveRequests(requests)

  return request
}

// Determine the currently assigned approver
export function getCurrentApprover(
  request: SpendRequest,
): Approver | undefined {

  if (request.status !== 'PENDING_APPROVAL') {
    return undefined
  }

  const decisions = (request.approvalDecisions ?? [])
    .filter(item => item.requestVersion === request.version)

  if (decisions.some(item => item.decision === 'REJECTED')) {
    return undefined
  }

  return request.approvalChain.find(approver =>

    !decisions.some(
      decision =>
        decision.approverId === approver.id &&
        decision.decision === 'APPROVED'
    )

  )
}

// Retrieve requests awaiting a specific user's decision
export function getPendingApprovals(
  approverId: string,
): SpendRequest[] {

  return getRequests().filter(request =>

    getCurrentApprover(request)?.id === approverId

  )
}

interface RecordDecisionInput {
  requestId: string
  requestVersion: number
  approverId: string
  decision: 'APPROVED' | 'REJECTED'
  reason?: string
}

// Record an approval or rejection
export function recordDecision(
  input: RecordDecisionInput,
): SpendRequest {

  const requests = getRequests()

  const request = requests.find(
    item => item.id === input.requestId
  )

  // 1. Validate request existence
  if (!request) {
    throw new Error('Request not found')
  }

  // 2. Prevent decisions on outdated request versions
  if (request.version !== input.requestVersion) {
    throw new Error('This request version is no longer current')
  }

  // 3. Validate request state
  if (request.status !== 'PENDING_APPROVAL') {
    throw new Error(
      'This request has already been processed'
    )
  }

  // 4. Validate approver identity
  const user = DEMO_USERS.find(
    item => item.id === input.approverId
  )

  if (
    !user ||
    !['MANAGER', 'APPROVER'].includes(user.role)
  ) {
    throw new Error('Invalid approval authority')
  }

  // 5. Prevent self-approval in the demo
  if (request.requester === user.name) {
    throw new Error('You cannot approve your own request')
  }

  // 6. Validate sequential approval authority
  const currentApprover = getCurrentApprover(request)

  if (currentApprover?.id !== input.approverId) {
    throw new Error(
      'This request is not currently assigned to you'
    )
  }

  // 7. Validate decision reason
  const reason = input.reason?.trim() ?? ''

  if (input.decision === 'REJECTED' && !reason) {
    throw new Error('Rejection reason is mandatory')
  }

  // 8. Create decision audit record
  const approvalDecision: ApprovalDecision = {
    id: crypto.randomUUID(),
    approverId: user.id,
    approverName: user.name,
    decision: input.decision,
    reason,
    decidedAt: new Date().toISOString(),
    requestVersion: request.version,
  }

  request.approvalDecisions ??= []

  request.approvalDecisions.push(approvalDecision)

  // 9. Update request state
  if (input.decision === 'REJECTED') {

    request.status = 'REJECTED'

  } else if (!getCurrentApprover(request)) {

    request.status = 'APPROVED'

  }

  // 10. Persist the updated request
  saveRequests(requests)

  return request
}

// Finance can retrieve fully approved requests
export function getApprovedRequests(): SpendRequest[] {

  return getRequests().filter(
    request => request.status === 'APPROVED'
  )
}
