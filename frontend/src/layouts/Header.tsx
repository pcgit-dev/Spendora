
import { Bell } from 'lucide-react'

import { DEMO_USERS } from '@/config/demoUsers'
import type { DemoUser } from '@/config/demoUsers'

interface HeaderProps {
  user: DemoUser
  onUserChange: (user: DemoUser) => void
}

export default function Header({
  user,
  onUserChange,
}: HeaderProps) {

  return (
    <header className="flex min-h-16 flex-wrap
                       items-center justify-between gap-3
                       border-b bg-white px-4 py-3 md:px-6">

      <div>
        <h2 className="text-sm font-semibold text-slate-800">
          Corporate Workspace
        </h2>

        <p className="text-xs text-slate-500">
          Spend Management Platform
        </p>
      </div>

      <div className="flex items-center gap-3">

        <span className="rounded-md bg-amber-100
                         px-2 py-1 text-xs text-amber-700">
          Demo Mode
        </span>

        <select
          aria-label="Switch demonstration user"
          value={user.id}
          className="max-w-full rounded-md border
                     bg-white px-3 py-2 text-sm"
          onChange={event => {
            const selectedUser = DEMO_USERS.find(
              item => item.id === event.target.value
            )

            if (selectedUser) {
              onUserChange(selectedUser)
            }
          }}
        >
          {DEMO_USERS.map(item => (
            <option key={item.id} value={item.id}>
              {item.name} — {item.roleLabel}
            </option>
          ))}
        </select>

        <Bell className="h-5 w-5 text-slate-500" />

        <div className="flex h-10 w-10 shrink-0
                        items-center justify-center
                        rounded-full bg-blue-100
                        font-semibold text-blue-700">
          {user.initials}
        </div>

        <div className="hidden lg:block">

          <p className="text-sm font-semibold">
            {user.name}
          </p>

          <p className="text-xs text-slate-500">
            {user.roleLabel}
          </p>

        </div>

      </div>
    </header>
  )
}
