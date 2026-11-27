
import { useState } from 'react'
import { useOutletContext } from 'react-router'

import {
  Clock,
  CheckCircle,
  FileText,
  ClipboardCheck,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'

import type { DemoUser } from '@/config/demoUsers'

import type {
  SpendRequest,
} from '@/features/requests/types'

import {
  getRequests,
  getCurrentApprover,
  recordDecision,
} from '@/features/requests/requestService'

import ApprovalHistory from './ApprovalHistory'

function formatAmount(request: SpendRequest) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: request.currency,
  }).format(request.amount)
}

function ApprovalWorkspace({
  user,
}: {
  user: DemoUser
}) {

  const [requests, setRequests] =
    useState<SpendRequest[]>(() => getRequests())

  const [selectedId, setSelectedId] =
    useState<string | null>(null)

  const [showHistory, setShowHistory] = useState(false)
  const [rejectMode, setRejectMode] = useState(false)
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  // Requests currently assigned to this user
  const pendingRequests = requests.filter(
    request =>
      getCurrentApprover(request)?.id === user.id
  )

  // Requests previously processed by this user
  const completedRequests = requests.filter(
    request =>
      (request.approvalDecisions ?? []).some(
        decision => decision.approverId === user.id
      )
  )

  const visibleRequests = showHistory
    ? completedRequests
    : pendingRequests

  const selectedRequest =
    visibleRequests.find(
      request => request.id === selectedId
    )

  function resetSelection() {
    setSelectedId(null)
    setRejectMode(false)
    setReason('')
    setError('')
  }

  function processDecision(
    decision: 'APPROVED' | 'REJECTED',
  ) {

    if (!selectedRequest) return

    try {

      const updatedRequest = recordDecision({
        requestId: selectedRequest.id,
        requestVersion: selectedRequest.version,
        approverId: user.id,
        decision,
        reason,
      })

      setRequests(current =>
        current.map(request =>
          request.id === updatedRequest.id
            ? updatedRequest
            : request
        )
      )

      if (updatedRequest.status === 'APPROVED') {

        setMessage(
          'Final approval completed. Request is now available to Finance.'
        )

      } else if (updatedRequest.status === 'REJECTED') {

        setMessage('Request rejected successfully.')

      } else {

        setMessage(
          'Approved. The request is now awaiting the next approver.'
        )

      }

      resetSelection()

    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : 'Unable to process decision'
      )

    }
  }

  return (
    <div className="space-y-6">

      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Waiting for Me
        </h1>

        <p className="text-sm text-slate-500">
          {user.name} · {user.roleLabel}
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2">

        <Card>
          <CardContent className="flex items-center
                                  justify-between p-5">

            <div>
              <p className="text-sm text-slate-500">
                Pending Approvals
              </p>

              <p className="mt-2 text-3xl font-bold
                            text-amber-600">
                {pendingRequests.length}
              </p>
            </div>

            <Clock className="h-8 w-8 text-amber-500" />

          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center
                                  justify-between p-5">

            <div>
              <p className="text-sm text-slate-500">
                Decisions Completed
              </p>

              <p className="mt-2 text-3xl font-bold
                            text-green-600">
                {completedRequests.length}
              </p>
            </div>

            <CheckCircle className="h-8 w-8 text-green-500" />

          </CardContent>
        </Card>

      </div>

      {/* Success message */}
      {message && (
        <div
          role="status"
          className="rounded-lg border border-green-200
                     bg-green-50 p-4 text-sm text-green-700"
        >
          {message}
        </div>
      )}

      {/* Queue tabs */}
      <div className="flex flex-wrap gap-3">

        <Button
          variant={!showHistory ? 'default' : 'outline'}
          onClick={() => {
            setShowHistory(false)
            resetSelection()
            setMessage('')
          }}
        >
          Pending Approvals ({pendingRequests.length})
        </Button>

        <Button
          variant={showHistory ? 'default' : 'outline'}
          onClick={() => {
            setShowHistory(true)
            resetSelection()
            setMessage('')
          }}
        >
          My Decisions ({completedRequests.length})
        </Button>

      </div>

      {/* Approval work queue */}
      <div className="grid gap-6 xl:grid-cols-[1fr_2fr]">

        <Card>
          <CardHeader>
            <CardTitle>
              {showHistory
                ? 'Completed Decisions'
                : 'Approval Queue'}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">

            {visibleRequests.length === 0 && (

              <div className="py-10 text-center">

                <ClipboardCheck className="mx-auto mb-3
                                           h-10 w-10
                                           text-slate-300" />

                <p className="text-sm text-slate-500">
                  No requests to display.
                </p>

              </div>

            )}

            {visibleRequests.map(request => (

              <button
                type="button"
                key={request.id}
                className={`w-full rounded-lg border
                            p-4 text-left transition-colors
                            ${
                              selectedId === request.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'hover:bg-slate-50'
                            }`}
                onClick={() => {
                  setSelectedId(request.id)
                  setRejectMode(false)
                  setReason('')
                  setError('')
                  setMessage('')
                }}
              >

                <p className="text-xs text-blue-600">
                  {request.id.slice(0, 12).toUpperCase()}
                </p>

                <p className="mt-2 font-semibold">
                  {request.title}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {request.requester} · {request.category}
                </p>

                <p className="mt-3 text-lg font-bold">
                  {formatAmount(request)}
                </p>

              </button>

            ))}

          </CardContent>
        </Card>

        {/* Selected request */}
        <div className="space-y-6">

          {!selectedRequest ? (

            <Card>
              <CardContent className="py-20 text-center">

                <FileText className="mx-auto mb-4
                                     h-12 w-12 text-slate-300" />

                <p className="font-semibold">
                  Select a request
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Select a request from the queue to review it.
                </p>

              </CardContent>
            </Card>

          ) : (

            <>

              <Card>
                <CardHeader>

                  <p className="text-xs text-slate-500">
                    {selectedRequest.id.slice(0, 12).toUpperCase()}
                    {' · Version '}
                    {selectedRequest.version}
                  </p>

                  <CardTitle>
                    {selectedRequest.title}
                  </CardTitle>

                </CardHeader>

                <CardContent className="space-y-5">

                  <div className="text-3xl font-bold
                                  text-slate-900">
                    {formatAmount(selectedRequest)}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">

                    {[
                      ['Requester', selectedRequest.requester],
                      ['Department', selectedRequest.department],
                      ['Category', selectedRequest.category],
                      ['Project', selectedRequest.project || 'N/A'],
                      ['Trip', selectedRequest.trip || 'N/A'],
                      ['Supplier', selectedRequest.supplier || 'N/A'],
                      ['Status', selectedRequest.status.replaceAll('_', ' ')],
                    ].map(([label, value]) => (

                      <div key={label}>

                        <p className="text-sm text-slate-500">
                          {label}
                        </p>

                        <p className="font-medium">
                          {value}
                        </p>

                      </div>

                    ))}

                  </div>

                  <div className="border-t pt-4">

                    <p className="text-sm text-slate-500">
                      Business Justification
                    </p>

                    <p className="mt-2 break-words text-sm">
                      {selectedRequest.justification}
                    </p>

                  </div>

                  <div className="rounded-lg bg-slate-100 p-4">

                    <p className="font-medium">
                      Supporting Quotation
                    </p>

                    <p className="mt-2 break-words text-sm">
                      {selectedRequest.quoteName ||
                       selectedRequest.noQuoteReason}
                    </p>

                    {selectedRequest.quoteName && (
                      <p className="mt-1 text-xs text-slate-500">
                        Demo: filename reference only.
                      </p>
                    )}

                  </div>

                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Approval Progress</CardTitle>
                </CardHeader>

                <CardContent>

                  <ApprovalHistory request={selectedRequest} />

                </CardContent>
              </Card>

              {!showHistory && (

                <Card>
                  <CardContent className="space-y-4 p-5">

                    <h3 className="font-semibold">
                      Your Decision
                    </h3>

                    {rejectMode ? (

                      <>

                        <Label htmlFor="rejectionReason">
                          Rejection Reason *
                        </Label>

                        <Textarea
                          id="rejectionReason"
                          rows={4}
                          value={reason}
                          onChange={event =>
                            setReason(event.target.value)
                          }
                          placeholder="Explain why this request is rejected"
                        />

                        <div className="flex flex-wrap gap-3">

                          <Button
                            variant="outline"
                            onClick={() => {
                              setRejectMode(false)
                              setReason('')
                              setError('')
                            }}
                          >
                            Cancel
                          </Button>

                          <Button
                            variant="destructive"
                            disabled={!reason.trim()}
                            onClick={() =>
                              processDecision('REJECTED')
                            }
                          >
                            Confirm Rejection
                          </Button>

                        </div>

                      </>

                    ) : (

                      <div className="grid gap-3 sm:grid-cols-2">

                        <Button
                          variant="outline"
                          className="border-red-500 text-red-600"
                          onClick={() => setRejectMode(true)}
                        >
                          Reject Request
                        </Button>

                        <Button
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() =>
                            processDecision('APPROVED')
                          }
                        >
                          Approve Request
                        </Button>

                      </div>

                    )}

                    {error && (
                      <p role="alert" className="text-sm text-red-600">
                        {error}
                      </p>
                    )}

                    <p className="text-xs text-slate-500">
                      Your decision will be recorded against
                      this request version.
                    </p>

                  </CardContent>
                </Card>

              )}

            </>

          )}

        </div>

      </div>
    </div>
  )
}

export default function ApprovalsPage() {

  const user = useOutletContext<DemoUser>()

  if (
    user.role !== 'MANAGER' &&
    user.role !== 'APPROVER'
  ) {
    return (
      <Card>
        <CardContent className="p-10 text-center">

          <h2 className="font-semibold">
            Access Restricted
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            This workspace is available to authorized approvers.
          </p>

        </CardContent>
      </Card>
    )
  }

  return (
    <ApprovalWorkspace
      key={user.id}
      user={user}
    />
  )
}
