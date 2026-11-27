import { Routes, Route, Navigate, Link } from 'react-router'
import AppLayout from '@/layouts/AppLayout'
import DashboardPage from '@/features/dashboard/DashboardPage'
import { Card, CardContent } from '@/components/ui/card'
import CreateRequestPage from '@/features/requests/CreateRequestPage'
import RequestsPage from '@/features/requests/RequestsPage'
import ApprovalsPage from '@/features/approvals/ApprovalsPage'
import FinancePreviewPage from '@/features/finance/FinancePreviewPage'
import { useOutletContext } from 'react-router'
import type { ReactNode } from 'react'
import type { DemoUser } from '@/config/demoUsers'
import { getHomeRoute } from '@/config/demoUsers'
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold text-slate-900">
        {title}
      </h1>

      <Card>
        <CardContent className="p-10 text-center">
          <h2 className="text-lg font-semibold">
            {title} Module
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            This module will be implemented in an upcoming step.
          </p>

          <Link
            to="/dashboard"
            className="mt-4 inline-block text-sm text-blue-600"
          >
            Back to Dashboard
          </Link>
        </CardContent>
      </Card>

    </div>
  )
}
function EmployeeOnly({
  children,
}: {
  children: ReactNode
}) {

  const user = useOutletContext<DemoUser>()

  if (user.role !== 'EMPLOYEE') {
    return (
      <Navigate
        to={getHomeRoute(user)}
        replace
      />
    )
  }

  return <>{children}</>
}
export default function App() {
  return (
    <Routes>

      <Route element={<AppLayout />}>

        <Route
          index
          element={<Navigate to="/dashboard" replace />}
        />

        <Route
          path="dashboard"
          element={<DashboardPage />}
        />

        <Route
          path="requests"
          element={
              <EmployeeOnly>
                <RequestsPage />
              </EmployeeOnly>
           }
        />
        <Route
          path="requests/new"
           element={
              <EmployeeOnly>
                <CreateRequestPage />
              </EmployeeOnly>
         }
        />

        <Route
          path="approvals"
          element={<ApprovalsPage />}
        />

        <Route
          path="finance"
          element={<FinancePreviewPage />}
        />

        <Route
          path="reports"
          element={<PlaceholderPage title="Reports" />}
        />

        <Route
          path="delegations"
          element={<PlaceholderPage title="Delegation" />}
        />

        <Route
          path="audit"
          element={<PlaceholderPage title="Audit History" />}
        />

        <Route
          path="settings"
          element={<PlaceholderPage title="Settings" />}
        />

        <Route
          path="*"
          element={<PlaceholderPage title="Page Not Found" />}
        />

      </Route>

    </Routes>
  )
}
