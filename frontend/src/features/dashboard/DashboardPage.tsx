
import {
  FileText,
  Clock,
  CircleCheck,
  CircleX,
  Plus,
} from 'lucide-react'

import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'

// Mock dashboard data
const metrics = [
  {
    title: 'My Requests',
    value: '12',
    icon: FileText,
    color: 'text-blue-600',
    background: 'bg-blue-50',
  },
  {
    title: 'Pending Approval',
    value: '3',
    icon: Clock,
    color: 'text-amber-600',
    background: 'bg-amber-50',
  },
  {
    title: 'Approved Spend',
    value: '$24,500',
    icon: CircleCheck,
    color: 'text-green-600',
    background: 'bg-green-50',
  },
  {
    title: 'Rejected Requests',
    value: '1',
    icon: CircleX,
    color: 'text-red-600',
    background: 'bg-red-50',
  },
]

const monthlySpend = [
  { month: 'Jun', amount: 2500 },
  { month: 'Jul', amount: 4200 },
  { month: 'Aug', amount: 3100 },
  { month: 'Sep', amount: 5600 },
  { month: 'Oct', amount: 4500 },
  { month: 'Nov', amount: 4600 },
]

const recentRequests = [
  {
    id: 'REQ-1042',
    title: 'Software Subscription',
    category: 'IT',
    amount: 8000,
    status: 'Pending',
  },
  {
    id: 'REQ-1041',
    title: 'Office Equipment',
    category: 'Office',
    amount: 1200,
    status: 'Approved',
  },
  {
    id: 'REQ-1040',
    title: 'Business Conference',
    category: 'Travel',
    amount: 2500,
    status: 'Paid',
  },
  {
    id: 'REQ-1039',
    title: 'Training Course',
    category: 'Learning',
    amount: 850,
    status: 'Rejected',
  },
]

const statusColors: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Approved: 'bg-green-100 text-green-700',
  Paid: 'bg-blue-100 text-blue-700',
  Rejected: 'bg-red-100 text-red-700',
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)

export default function DashboardPage() {
  return (
    <div className="space-y-6">

      {/* Page heading */}
      <div className="flex flex-wrap items-center
                      justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome, Priya
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Here is your spending and approval overview.
          </p>
        </div>

        <Link to="/requests/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4
                      sm:grid-cols-2 xl:grid-cols-4">

        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardContent className="p-5">

              <div className="flex items-center
                              justify-between gap-2">

                <div>
                  <p className="text-sm text-slate-500">
                    {metric.title}
                  </p>

                  <p className="mt-2 text-2xl
                                font-bold text-slate-900">
                    {metric.value}
                  </p>
                </div>

                <div className={`rounded-xl p-3
                                 ${metric.background}`}>
                  <metric.icon
                    className={`h-6 w-6 ${metric.color}`}
                  />
                </div>

              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Monthly expenditure chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Approved Expenditure</CardTitle>
          <p className="text-sm text-slate-500">
            Approved spend over the last six months
          </p>
        </CardHeader>

        <CardContent>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySpend}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis dataKey="month" />
                <YAxis
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip
                  formatter={(value) =>
                    formatCurrency(Number(value))
                  }
                />
                <Bar
                  dataKey="amount"
                  name="Approved spend"
                  fill="#2563eb"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent requests */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Spend Requests</CardTitle>

            <Link
              to="/requests"
              className="text-sm font-medium text-blue-600"
            >
              View all
            </Link>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">

              <thead className="border-b bg-slate-50
                                text-slate-500">
                <tr>
                  <th className="p-3">Request ID</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {recentRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-b hover:bg-slate-50"
                  >
                    <td className="whitespace-nowrap p-3
                                   font-medium text-blue-600">
                      {request.id}
                    </td>

                    <td className="p-3">{request.title}</td>

                    <td className="p-3">{request.category}</td>

                    <td className="whitespace-nowrap p-3 font-medium">
                      {formatCurrency(request.amount)}
                    </td>

                    <td className="p-3">
                      <span className={`rounded-full px-3 py-1
                                       text-xs font-medium
                                       ${statusColors[request.status]}`}>
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
