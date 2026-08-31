export const reconciliationKeys = {
  all: ["reconciliation"] as const,
  transactions: () => [...reconciliationKeys.all, "transactions"] as const,
  matches: () => [...reconciliationKeys.all, "matches"] as const,
  rules: () => [...reconciliationKeys.all, "rules"] as const,
  exceptions: () => [...reconciliationKeys.all, "exceptions"] as const,
  audit: () => [...reconciliationKeys.all, "audit"] as const,
};
