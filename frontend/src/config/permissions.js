// Mirrors backend/config/permissions.js. The backend is the real
// enforcement boundary — this only drives what the UI shows, so a manager
// never sees actions they'd get a 403 for.
export const ROLES = ['admin', 'manager', 'user'];

export const PERMISSIONS = {
  admin: ['*'],
  manager: [
    'reports.view',
    'services.view',
    'services.create',
    'services.update',
    'services.delete',
    'portfolio.view',
    'portfolio.create',
    'portfolio.update',
    'portfolio.delete',
    'events.view',
    'events.create',
    'events.update',
    'events.delete',
    'messages.view',
    'messages.update'
  ],
  user: []
};

export function hasPermission(role, permission) {
  const granted = PERMISSIONS[role] || [];
  return granted.includes('*') || granted.includes(permission);
}

export function isStaffRole(role) {
  return role === 'admin' || role === 'manager';
}
