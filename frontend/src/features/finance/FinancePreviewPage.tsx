
import { useOutletContext } from 'react-router'

import type { DemoUser } from '@/config/demoUsers'

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'

import {
  getApprovedRequests,
} from '@/features/requests/requestService'

export default function FinancePreviewPage() {

  const user = useOutletContext<DemoUser>()

  if (user.role !== 'FINANCE') {
    return (
      <p className="rounded-lg border bg-white p-6">
        Access Restricted — Finance users only.
      </p>
    )
  }

  const requests = getApprovedRequests()

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold">
          Finance Workspace
        </h1>

        <p className="text-sm text-slate-500">
          {user.name} · Approved expenditure commitments
        </p>
      </div>

      <Card>
        <CardContent className="p-5">

          <p className="text-sm text-slate-500">
            Approved Requests
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {requests.length}
          </p>

        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Awaiting Invoice Processing</CardTitle>
        </CardHeader>

        <CardContent className="overflow-x-auto">

          <table className="w-full text-left text-sm">

            <thead className="border-b bg-slate-50">
              <tr>
                <th className="p-3">Request</th>
                <th className="p-3">Employee</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>

              {requests.map(request => (

                <tr key={request.id} className="border-b">

                  <td className="p-3">
                    {request.title}
                  </td>

                  <td className="p-3">
                    {request.requester}
                  </td>

                  <td className="whitespace-nowrap p-3 font-medium">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: request.currency,
                    }).format(request.amount)}
                  </td>

                  <td className="p-3 text-green-700">
                    Approved
                  </td>

                </tr>

              ))}

              {requests.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-10 text-center">
                    No approved requests available.
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </CardContent>
      </Card>

    </div>
  )
}
