import { BriefcaseBusiness, CalendarDays, History, Image, Inbox, LayoutDashboard, Users } from 'lucide-react';

export const adminNav = [
  {
    section: 'Dashboard',
    items: [{ label: 'Overview', to: '/admin', icon: LayoutDashboard, end: true }]
  },
  {
    section: 'Modules',
    items: [
      { label: 'Services', to: '/admin/services', icon: BriefcaseBusiness },
      { label: 'Portfolio', to: '/admin/portfolio', icon: Image },
      { label: 'Events', to: '/admin/events', icon: CalendarDays }
    ]
  },
  {
    section: 'Management',
    items: [{ label: 'Users', to: '/admin/users', icon: Users, adminOnly: true }]
  },
  {
    section: 'Reports',
    items: [{ label: 'Messages', to: '/admin/messages', icon: Inbox }]
  },
  {
    section: 'Security',
    items: [{ label: 'Audit Log', to: '/admin/audit-log', icon: History, adminOnly: true }]
  }
];

export const adminNavFlat = adminNav.flatMap((group) => group.items);
