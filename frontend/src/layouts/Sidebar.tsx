
import {
  LayoutDashboard,
  FileText,
  ClipboardCheck,
  Wallet,
  BarChart3,
  Users,
  ShieldCheck,
  Settings,
} from 'lucide-react'
import { NavLink } from 'react-router'

const navigation = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'My Requests', path: '/requests', icon: FileText },
  { name: 'Approvals', path: '/approvals', icon: ClipboardCheck },
  { name: 'Finance', path: '/finance', icon: Wallet },
  { name: 'Reports', path: '/reports', icon: BarChart3 },
  { name: 'Delegation', path: '/delegations', icon: Users },
  { name: 'Audit', path: '/audit', icon: ShieldCheck },
  { name: 'Settings', path: '/settings', icon: Settings },
]

export default function Sidebar() {
  return (
    <aside className="flex w-full shrink-0 flex-col
                      bg-[#172554] text-white md:w-64">

      {/* Application branding */}
      <div className="flex items-center gap-3 px-6 py-6">
        <Wallet className="h-8 w-8 text-blue-300" />

        <span className="text-2xl font-bold">
          spendora.
        </span>
      </div>

      <div className="px-6 pb-3 text-xs font-semibold
                      tracking-wider text-slate-400">
        WORKSPACE
      </div>

      {/* Navigation menu */}
      <nav className="grid grid-cols-2 gap-1 px-3 pb-4
                      md:flex md:flex-1 md:flex-col">
        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg
               px-4 py-3 text-sm transition-colors
               ${isActive
                 ? 'bg-blue-600 text-white'
                 : 'text-slate-300 hover:bg-white/10'
               }`
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="hidden border-t border-white/10
                      p-5 text-xs text-slate-400 md:block">
        Spendora v0.1.0
        <br />
        Demo Environment
      </div>
    </aside>
  )
}
