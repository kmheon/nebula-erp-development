export const currencyKeys = {
  all: ["currency"] as const,
  currencies: () => [...currencyKeys.all, "currencies"] as const,
  rates: () => [...currencyKeys.all, "rates"] as const,
  settings: () => [...currencyKeys.all, "settings"] as const,
};
