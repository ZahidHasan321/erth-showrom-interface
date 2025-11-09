import { createOrder, updateOrder, deleteOrder } from "@/api/orders";
import { updateShelf } from "@/api/shelves";
import { updateFabric } from "@/api/fabrics";
import { mapApiOrderToFormOrder, mapFormOrderToApiOrder } from "@/lib/order-mapper";
import { type OrderSchema } from "@/schemas/work-order-schema";
import { type ShelvesFormValues } from "@/components/forms/shelved-products/schema";
import { type FabricSelectionSchema } from "@/components/forms/fabric-selection-and-options/fabric-selection/fabric-selection-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type UpdateOrderPayload = {
  fields: Partial<OrderSchema>;
  orderId: string;
  onSuccessAction?: "customer" | "payment" | "fabric" | "campaigns" | "updated" | "cancelled" | null;
};

type UseOrderMutationsOptions = {
  onOrderCreated?: (orderId: string, order: OrderSchema) => void;
  onOrderUpdated?: (action: string | null | undefined) => void;
  onOrderError?: () => void;
  orderType?: "work" | "sales";
};

export function useOrderMutations(options: UseOrderMutationsOptions = {}) {
  const queryClient = useQueryClient();

  const createOrderMutation = useMutation({
    mutationFn: (additionalFields?: Partial<OrderSchema>) => {
      const fields: any = {
        OrderStatus: "Pending",
        OrderDate: new Date().toISOString()
      };

      // Merge additional fields if provided
      if (additionalFields) {
        const mappedFields = mapFormOrderToApiOrder(additionalFields);
        Object.assign(fields, mappedFields.fields);
      }

      // Set OrderType AFTER merging to ensure it's not overwritten
      if (options.orderType) {
        fields.OrderType = options.orderType;
      }

      return createOrder({ fields });
    },
    onSuccess: (response) => {
      if (response.data) {
        const order = response.data;
        const formattedOrder = mapApiOrderToFormOrder(order);
        options.onOrderCreated?.(order.id, formattedOrder);
        toast.success("New order created successfully!");
      }
    },
    onError: () => {
      toast.error("Failed to create new order.");
      options.onOrderError?.();
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ fields, orderId }: UpdateOrderPayload) => {
      const orderMapped = mapFormOrderToApiOrder(fields);
      return updateOrder(orderMapped["fields"], orderId);
    },
    onSuccess: (_response, variables) => {
      const action = variables.onSuccessAction;
      if (action === "customer") {
        toast.success("Customer updated ✅");
      } else if (action === "cancelled") {
        toast.success("Order cancelled");
      }
      options.onOrderUpdated?.(action);
    },
    onError: () => toast.error("Failed to update order"),
  });

  const updateShelfMutation = useMutation({
    mutationFn: (shelvedData: ShelvesFormValues) => {
      const promises = shelvedData.products.map((item) => {
        if (item.id && item.Stock !== undefined && item.quantity) {
          return updateShelf(item.id, { Stock: item.Stock - item.quantity });
        }
        return Promise.resolve(null);
      });
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      toast.error("Unable to update the shelves stock");
    },
  });

  const updateFabricStockMutation = useMutation({
    mutationFn: async ({
      fabricSelections,
      fabricsData,
    }: {
      fabricSelections: FabricSelectionSchema[];
      fabricsData: any[];
    }) => {
      const internalFabrics = fabricSelections.filter(
        (fabric) => fabric.fabricSource === "In" && fabric.fabricId
      );

      if (internalFabrics.length === 0) {
        return Promise.resolve([]);
      }

      const promises = internalFabrics.map((fabricSelection) => {
        const currentFabric = fabricsData.find((f) => f.id === fabricSelection.fabricId);
        const currentId = fabricSelection.fabricId;

        if (!currentFabric || !currentId) {
          console.error(`Fabric not found: ${fabricSelection.fabricId}`);
          return Promise.resolve(null);
        }

        const currentStock = currentFabric.fields.RealStock || 0;
        const usedLength = parseFloat(fabricSelection.fabricLength);

        if (isNaN(usedLength) || usedLength <= 0) {
          console.error(`Invalid fabric length: ${fabricSelection.fabricLength}`);
          return Promise.resolve(null);
        }

        const newStock = currentStock - usedLength;

        if (newStock < 0) {
          console.error(
            `Insufficient stock for fabric ${fabricSelection.fabricId}. Current: ${currentStock}, Requested: ${usedLength}`
          );
          return Promise.resolve(null);
        }

        return updateFabric(currentId, {
          ...currentFabric.fields,
          RealStock: newStock,
        });
      });

      return Promise.all(promises);
    },
    onSuccess: (results) => {
      const successCount = results.filter((r) => r !== null).length;
      if (successCount > 0) {
        queryClient.invalidateQueries({ queryKey: ["fabrics"] });
      }
    },
    onError: (error) => {
      console.error("Failed to update fabric stock:", error);
      toast.error("Failed to update fabric stock");
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: (orderId: string) => {
      return deleteOrder(orderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: () => {
      toast.error("Failed to delete order");
    },
  });

  return {
    createOrder: createOrderMutation,
    updateOrder: updateOrderMutation,
    updateShelf: updateShelfMutation,
    updateFabricStock: updateFabricStockMutation,
    deleteOrder: deleteOrderMutation,
  };
}
