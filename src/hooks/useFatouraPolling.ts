import { useQuery } from "@tanstack/react-query";
import { getOrderById } from "@/api/orders";
import { useEffect, useState, useRef } from "react";
import { showFatouraNotification, requestNotificationPermission } from "@/lib/notifications";

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
  const hasRequestedPermission = useRef(false);
  const hasShownNotification = useRef(false);

  // Only poll if order is completed and we don't have a fatoura yet
  const shouldPoll = Boolean(enabled && isOrderCompleted && orderRecordId && !fatoura);

  // Request notification permission when polling starts
  useEffect(() => {
    if (shouldPoll && !hasRequestedPermission.current) {
      hasRequestedPermission.current = true;
      requestNotificationPermission().catch((error) => {
        console.error("Failed to request notification permission:", error);
      });
    }
  }, [shouldPoll]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["order", orderRecordId, "fatoura"],
    queryFn: () => getOrderById(orderRecordId!),
    enabled: shouldPoll,
    refetchInterval: shouldPoll ? 2000 : false,
    retry: 3,
  });

  useEffect(() => {
    const orderData = data as any;

    if (orderData?.data?.fields?.Fatoura) {
      const fatouraNumber = orderData.data.fields.Fatoura;
      setFatoura(fatouraNumber);
      setIsPolling(false);

      // Show notification when fatoura is received (only once per order)
      if (!hasShownNotification.current) {
        hasShownNotification.current = true;
        showFatouraNotification(fatouraNumber);
      }
    } else if (shouldPoll) {
      setIsPolling(true);
    } else {
      setIsPolling(false);
    }
  }, [data, shouldPoll]);

  // Reset when order changes or becomes not completed
  useEffect(() => {
    if (!isOrderCompleted) {
      setFatoura(undefined);
      setIsPolling(false);
      hasShownNotification.current = false;
      hasRequestedPermission.current = false;
    }
  }, [isOrderCompleted, orderRecordId]);

  return {
    fatoura,
    isLoadingFatoura: isPolling || isLoading,
    fatouraError: error,
    hasFatoura: !!fatoura,
  };
}
