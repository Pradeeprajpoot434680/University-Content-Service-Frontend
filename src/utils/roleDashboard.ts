export type DashboardLink = {
  label: string;
  path: string;
};

const roleDashboards: Array<{ matches: string[]; link: DashboardLink }> = [
  {
    matches: ['GLOBAL_ADMIN', 'ADMIN', 'GLOBAL'],
    link: { label: 'Admin Panel', path: '/global-admin' },
  },
  {
    matches: ['UNIVERSITY_ADMIN', 'UNIVERSITY_REP', 'UNIVERSITY'],
    link: { label: 'Admin Panel', path: '/university-admin' },
  },
  {
    matches: ['DEPARTMENT_ADMIN', 'DEPARTMENT_REP', 'DEPARTMENT'],
    link: { label: 'Admin Panel', path: '/department-admin' },
  },
  {
    matches: ['PROGRAM_ADMIN', 'PROGRAM_REP', 'PROGRAM'],
    link: { label: 'Admin Panel', path: '/program-admin' },
  },
  {
    matches: ['SESSION_ADMIN', 'SESSION_REP', 'SESSION'],
    link: { label: 'Admin Panel', path: '/session-admin' },
  },
];

const normalizeRole = (role: string) =>
  role.trim().toUpperCase().replace(/^ROLE_/, '').replace(/[\s-]+/g, '_');

export const getRoleDashboard = (roles: string[] = []) => {
  const normalizedRoles = roles.map(normalizeRole);

  return roleDashboards.find(({ matches }) =>
    matches.some((role) => normalizedRoles.includes(role))
  )?.link;
};

export const hasRoleMatch = (roles: string[] = [], matches: string[] = []) => {
  const normalizedRoles = roles.map(normalizeRole);
  return matches.some((role) => normalizedRoles.includes(normalizeRole(role)));
};
