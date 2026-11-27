
import { Bell } from 'lucide-react'

export default function Header() {
  return (
    <header className="flex h-16 items-center
                       justify-between border-b
                       bg-white px-4 md:px-6">

      <div>
        <h2 className="text-sm font-semibold text-slate-800">
          Corporate Workspace
        </h2>

        <p className="text-xs text-slate-500">
          Spend Management Platform
        </p>
      </div>

      <div className="flex items-center gap-4">

        {/* Notification preview */}
        <div
          className="relative"
          aria-label="Notifications preview"
        >
          <Bell className="h-5 w-5 text-slate-600" />

          <span className="absolute -right-1 -top-1
                           h-2.5 w-2.5 rounded-full
                           bg-red-500" />
        </div>

        <div className="h-8 w-px bg-slate-200" />

        {/* User profile */}
        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center
                          justify-center rounded-full
                          bg-blue-100 font-semibold
                          text-blue-700">
            PS
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">
              Priya Sharma
            </p>

            <p className="text-xs text-slate-500">
              Employee
            </p>
          </div>

        </div>
      </div>
    </header>
  )
}
