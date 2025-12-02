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

  console.log('useFatouraPolling state:', {
    orderRecordId,
    isOrderCompleted,
    enabled,
    fatoura,
    shouldPoll
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["order", orderRecordId, "fatoura"],
    queryFn: () => {
      console.log('Fetching order for fatoura:', orderRecordId);
      return getOrderById(orderRecordId!);
    },
    enabled: shouldPoll,
    refetchInterval: shouldPoll ? 2000 : false,
    retry: 3,
  });

  useEffect(() => {
    const orderData = data as any;

    console.log('Data effect triggered:', {
      hasFatourainData: !!orderData?.data?.fields?.Fatoura,
      fatouraValue: orderData?.data?.fields?.Fatoura,
      shouldPoll,
      rawData: orderData
    });

    if (orderData?.data?.fields?.Fatoura) {
      console.log('Setting fatoura:', orderData.data.fields.Fatoura);
      setFatoura(orderData.data.fields.Fatoura);
      setIsPolling(false);
    } else if (shouldPoll) {
      setIsPolling(true);
    } else {
      setIsPolling(false);
    }
  }, [data, shouldPoll]);

  // Reset when order changes or becomes not completed
  useEffect(() => {
    console.log('Reset effect:', { isOrderCompleted, orderRecordId });
    if (!isOrderCompleted) {
      console.log('Resetting fatoura state');
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
