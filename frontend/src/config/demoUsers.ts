export type DemoRole =
  | 'EMPLOYEE'
  | 'MANAGER'
  | 'APPROVER'
  | 'FINANCE'

export interface DemoUser {
  id: string
  name: string
  initials: string
  role: DemoRole
  roleLabel: string
  department: string
}

export const DEMO_USERS: DemoUser[] = [
  {
    id: 'EMP-003',
    name: 'Priya Sharma',
    initials: 'PS',
    role: 'EMPLOYEE',
    roleLabel: 'Employee',
    department: 'Operations',
  },
  {
    id: 'EMP-001',
    name: 'John Becker',
    initials: 'JB',
    role: 'MANAGER',
    roleLabel: 'Line Manager',
    department: 'Operations',
  },
  {
    id: 'EMP-002',
    name: 'Nadia Frost',
    initials: 'NF',
    role: 'APPROVER',
    roleLabel: 'Authorized Approver',
    department: 'Management',
  },
  {
    id: 'EMP-004',
    name: 'Tom Becker',
    initials: 'TB',
    role: 'FINANCE',
    roleLabel: 'Finance',
    department: 'Finance',
  },
]

export const DEFAULT_USER = DEMO_USERS[0]

export function getHomeRoute(user: DemoUser): string {
  switch (user.role) {
    case 'MANAGER':
    case 'APPROVER':
      return '/approvals'

    case 'FINANCE':
      return '/finance'

    default:
      return '/dashboard'
  }
}