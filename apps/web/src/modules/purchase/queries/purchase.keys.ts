export const purchaseKeys = {
  all: ["purchase"] as const,

  suppliers: () => [
    ...purchaseKeys.all,
    "suppliers",
  ] as const,

  orders: () => [
    ...purchaseKeys.all,
    "orders",
  ] as const,

  goodsReceives: () => [
    ...purchaseKeys.all,
    "goods-receives",
  ] as const,

  vendorBills: () => [
    ...purchaseKeys.all,
    "vendor-bills",
  ] as const,

  matching: (poId: string) => [
    ...purchaseKeys.all,
    "matching",
    poId,
  ] as const,

  landedCosts: () => [
    ...purchaseKeys.all,
    "landed-costs",
  ] as const,
};
