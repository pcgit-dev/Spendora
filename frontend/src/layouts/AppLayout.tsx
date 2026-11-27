import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router'

import Sidebar from './Sidebar'
import Header from './Header'

import {
  DEFAULT_USER,
  getHomeRoute,
} from '@/config/demoUsers'

import type { DemoUser } from '@/config/demoUsers'

export default function AppLayout() {

  const navigate = useNavigate()

  const [user, setUser] =
    useState<DemoUser>(DEFAULT_USER)

  function handleUserChange(selectedUser: DemoUser) {
    setUser(selectedUser)
    navigate(getHomeRoute(selectedUser))
  }

  return (
    <div className="flex min-h-screen flex-col
                    bg-slate-50 md:flex-row">

      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">

        <Header
          user={user}
          onUserChange={handleUserChange}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8">

          <Outlet context={user} />

        </main>

      </div>
    </div>
  )
}