export const approvalKeys = {
  all: ["approval"] as const,
  templates: () => [...approvalKeys.all, "templates"] as const,
  rules: () => [...approvalKeys.all, "rules"] as const,
  requests: () => [...approvalKeys.all, "requests"] as const,
  delegations: () => [...approvalKeys.all, "delegations"] as const,
  notifications: () => [...approvalKeys.all, "notifications"] as const,
};
