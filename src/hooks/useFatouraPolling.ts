import { useQuery } from "@tanstack/react-query";
import { getOrderById } from "@/api/orders";
import { useEffect, useState } from "react";

/**
 * Hook to poll for fatoura number after order is completed
 * @param orderRecordId - The Airtable record ID of the order
 * @param isOrderCompleted - Whether the order status is "Completed"
 * @param enabled - Whether to enable polling
 * @returns Object with fatoura number, loading state, and error
 */
export function useFatouraPolling(
  orderRecordId: string | null | undefined,
  isOrderCompleted: boolean,
  enabled = true
) {
  const [fatoura, setFatoura] = useState<number | undefined>(undefined);
  const [isPolling, setIsPolling] = useState(false);

  // Only poll if order is completed and we don't have a fatoura yet
  const shouldPoll = Boolean(enabled && isOrderCompleted && orderRecordId && !fatoura);

  const { data, isLoading, error } = useQuery({
    queryKey: ["order", orderRecordId, "fatoura"],
    queryFn: () => getOrderById(orderRecordId!),
    enabled: shouldPoll,
    refetchInterval: (query) => {
      // Stop polling if we got the fatoura or there's an error
      const orderData = query.state.data as any;
      if (orderData?.data?.fields?.Fatoura || query.state.error) {
        return false;
      }
      // Poll every 2 seconds
      return 2000;
    },
    retry: 3,
  });

  useEffect(() => {
    const orderData = data as any;

    if (orderData?.data?.fields?.Fatoura) {
      setFatoura(orderData.data.fields.Fatoura);
      setIsPolling(false);
    } else if (shouldPoll) {
      setIsPolling(true);
    }
  }, [data, shouldPoll]);

  // Reset when order changes
  useEffect(() => {
    if (!isOrderCompleted) {
      setFatoura(undefined);
      setIsPolling(false);
    }
  }, [isOrderCompleted, orderRecordId]);

  return {
    fatoura,
    isLoadingFatoura: isPolling || isLoading,
    fatouraError: error,
    hasFatoura: !!fatoura,
  };
}
