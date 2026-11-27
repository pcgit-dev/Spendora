
import {
  CircleCheck,
  CircleX,
  Clock,
  MinusCircle,
} from 'lucide-react'

import type { SpendRequest } from '@/features/requests/types'

import {
  getCurrentApprover,
} from '@/features/requests/requestService'

export default function ApprovalHistory({
  request,
}: {
  request: SpendRequest
}) {

  const currentApprover = getCurrentApprover(request)

  const decisions = (request.approvalDecisions ?? [])
    .filter(item => item.requestVersion === request.version)

  return (
    <div className="space-y-4">

      {request.approvalChain.map(approver => {

        const decision = decisions.find(
          item => item.approverId === approver.id
        )

        const isCurrent =
          currentApprover?.id === approver.id

        const isTerminated =
          request.status === 'REJECTED' ||
          request.status === 'CANCELLED'

        return (
          <div
            key={approver.id}
            className="flex items-start gap-3
                       rounded-lg border p-4"
          >

            <div className="pt-1">

              {decision?.decision === 'APPROVED' ? (

                <CircleCheck className="h-6 w-6 text-green-600" />

              ) : decision?.decision === 'REJECTED' ? (

                <CircleX className="h-6 w-6 text-red-600" />

              ) : isTerminated ? (

                <MinusCircle className="h-6 w-6 text-slate-400" />

              ) : (

                <Clock className={`h-6 w-6 ${
                  isCurrent
                    ? 'text-amber-500'
                    : 'text-slate-300'
                }`} />

              )}

            </div>

            <div className="min-w-0 flex-1">

              <p className="font-semibold">
                {approver.name}
              </p>

              <p className="text-sm text-slate-500">
                {approver.role}
              </p>

              {decision ? (

                <div className="mt-2 space-y-1 text-sm">

                  <p className={
                    decision.decision === 'APPROVED'
                      ? 'font-medium text-green-700'
                      : 'font-medium text-red-700'
                  }>
                    {decision.decision}
                  </p>

                  <p className="text-xs text-slate-500">
                    {new Date(
                      decision.decidedAt
                    ).toLocaleString()}
                    {' · Version '}
                    {decision.requestVersion}
                  </p>

                  {decision.reason && (
                    <p className="break-words">
                      Reason: {decision.reason}
                    </p>
                  )}

                </div>

              ) : (

                <p className="mt-2 text-sm text-slate-500">
                  {isCurrent
                    ? 'Awaiting decision'
                    : isTerminated
                      ? 'Workflow terminated'
                      : 'Waiting for previous approval'}
                </p>

              )}

            </div>
          </div>
        )
      })}

    </div>
  )
}
