// Granular permission catalog for role-based access control.
// 'admin' has unrestricted access via the '*' wildcard; every other
// role must be explicitly granted each permission it needs.
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

// Roles allowed to enter the admin backoffice at all (per-page/action
// access within it is still gated by hasPermission()).
export function isStaffRole(role) {
  return role === 'admin' || role === 'manager';
}
