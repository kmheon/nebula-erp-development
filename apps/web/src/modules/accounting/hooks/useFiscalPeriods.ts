/**
 * React Query Hook for Fiscal Periods & Governance.
 */

import { useQuery } from "@tanstack/react-query";
import { getFiscalPeriods } from "../services/accounting.service";
import { accountingKeys } from "../queries/accounting.keys";

export function useFiscalPeriods() {
  return useQuery({
    queryKey: accountingKeys.fiscalPeriods(),
    queryFn: async () => {
      const response = await getFiscalPeriods();
      return response.data ?? [];
    },
  });
}
