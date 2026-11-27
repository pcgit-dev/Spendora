import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Wallet, Plus } from 'lucide-react'

function App() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">

      <header className="flex items-center gap-3">
        <Wallet className="h-8 w-8 text-blue-600" />

        <h1 className="text-3xl font-bold text-slate-900">
          Spendora
        </h1>
      </header>

      <p className="mt-2 text-slate-500">
        Corporate Spend Management Platform
      </p>

      <Card className="mt-8 max-w-sm">
        <CardHeader>
          <CardTitle>Welcome to Spendora</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-slate-500">
            Manage your expenditure, approvals
            and financial commitments.
          </p>

          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </CardContent>
      </Card>

    </div>
  )
}
export default App