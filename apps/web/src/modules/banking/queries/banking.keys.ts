export const bankingKeys = {
  all: ["banking"] as const,
  accounts: () => [...bankingKeys.all, "accounts"] as const,
  transactions: () => [...bankingKeys.all, "transactions"] as const,
};
