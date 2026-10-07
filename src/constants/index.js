export const ROLES = {
  CANDIDATE: 'candidate',
  PARTNER_RECRUITER: 'partner_recruiter',
  PARTNER_ADMIN: 'partner_admin',
  SUPER_ADMIN: 'super_admin',
}

export const JOB_STATUS = {
  DRAFT: 'draft',
  PENDING_REVIEW: 'pending_review',
  PUBLISHED: 'published',
  CLOSED: 'closed',
  REJECTED: 'rejected',
}

export const APPLICATION_STATUS = {
  APPLIED: 'applied',
  SHORTLISTED: 'shortlisted',
  INTERVIEW: 'interview',
  OFFERED: 'offered',
  HIRED: 'hired',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn',
}

export const ACCOUNT_STATUS = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
}

// Login ke baad role ke hisaab se kahan bhejna hai
export const ROLE_HOME = {
  [ROLES.CANDIDATE]: '/candidate',
  [ROLES.PARTNER_RECRUITER]: '/partner',
  [ROLES.PARTNER_ADMIN]: '/partner',
  [ROLES.SUPER_ADMIN]: '/admin',
}
