
import { Outlet } from 'react-router'
import Sidebar from './Sidebar'
import Header from './Header'

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col
                    bg-slate-50 md:flex-row">

      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">

        <Header />

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>

      </div>
    </div>
  )
}
